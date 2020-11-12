import { getRepository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { EntityNotFoundError } from "../common/error/entity-not-found-error";
import { ISSUESTATE } from "../common/type";
import { Issue } from "../model/issue";
import { IssueContent } from "../model/issue-content";
import { Label } from "../model/label";
import { LabelToIssue } from "../model/label-to-issue";
import { Milestone } from "../model/milestone";
import { User } from "../model/user";
import { UserToIssue } from "../model/user-to-issue";

class IssueService {
    static instance = null;

    static getInstance() {
        if (IssueService.instance === null) {
            IssueService.instance = new IssueService();
        }
        return IssueService.instance;
    }

    constructor() {
        this.userRepository = getRepository(User);
        this.issueRepository = getRepository(Issue);
        this.labelRepository = getRepository(Label);
        this.milestoneRepository = getRepository(Milestone);
        this.issueContentRepository = getRepository(IssueContent);
        this.userToIssueRepository = getRepository(UserToIssue);
        this.labelToIssueRepository = getRepository(LabelToIssue);
    }

    @Transactional()
    async addIssue({ userId, title, content, assigneeIds, labelIds, milestoneId }) {
        const promises = [];

        promises.push(this.userRepository.findOne(userId));

        if (assigneeIds?.length > 0) {
            promises.push(this.userRepository.findByIds(assigneeIds));
        } else {
            promises.push([]);
        }

        if (labelIds?.length > 0) {
            promises.push(this.labelRepository.findByIds(labelIds));
        } else {
            promises.push([]);
        }

        if (milestoneId !== undefined) {
            promises.push(this.milestoneRepository.findOne(milestoneId));
        } else {
            promises.push(undefined);
        }

        const [author, assignees, labels, milestone] = await Promise.all(promises);

        if (
            author === undefined ||
            assignees.length !== (assigneeIds?.length ?? 0) ||
            labels.length !== (labelIds?.length ?? 0) ||
            milestone?.id !== milestoneId
        ) {
            throw new EntityNotFoundError();
        }

        const userToIssues = this.userToIssueRepository.create(
            assignees.map((assignee) => ({
                user: assignee
            }))
        );
        const issueContent = this.issueContentRepository.create({ content });
        const labelToIssues = this.labelToIssueRepository.create(labels.map((label) => ({ label })));
        const issue = this.issueRepository.create({ title, author, milestone, userToIssues, labelToIssues, content: issueContent });
        await this.issueRepository.save(issue);

        return issue;
    }

    async getUserById(id) {
        const user = await this.userRepository.findOne(id);
        return user;
    }

    async getIssueById(id) {
        const issue = await this.issueRepository.findOne(id);
        return issue;
    }

    @Transactional()
    async addAssignee(assigneeId, issueId) {
        const targetUser = await this.getUserById(assigneeId);
        const targetIssue = await this.getIssueById(issueId);
        if (targetUser === undefined || targetIssue === undefined) {
            throw new EntityNotFoundError();
        }

        const newAssignee = this.userToIssueRepository.create({ user: targetUser, issue: targetIssue });
        await this.userToIssueRepository.save(newAssignee);
        return newAssignee;
    }

    @Transactional()
    async removeAssignee(assigneeId, issueId) {
        const targetUser = await this.getUserById(assigneeId);
        const targetIssue = await this.getIssueById(issueId);
        if (targetUser === undefined || targetIssue === undefined) {
            throw new EntityNotFoundError();
        }

        const targetAssignee = await this.userToIssueRepository.findOne({ user: targetUser, issue: targetIssue });
        const removedAssignee = await this.userToIssueRepository.remove(targetAssignee);
        return removedAssignee;
    }

    @Transactional()
    async addMilestone(isssueId, milestoneId) {
        const targetIssue = await this.issueRepository.findOne(isssueId);
        const targetMilestone = await this.milestoneRepository.findOne(milestoneId);
        if (targetIssue === undefined || targetMilestone === undefined) {
            throw new EntityNotFoundError();
        }

        targetIssue.milestone = targetMilestone;
        await this.issueRepository.save(targetIssue);
        return targetIssue;
    }

    @Transactional()
    async removeMilestone(isssueId, milestoneId) {
        const targetIssue = await this.issueRepository.findOne(isssueId);
        const targetMilestone = await this.milestoneRepository.findOne(milestoneId);
        if (targetIssue === undefined || targetMilestone === undefined) {
            throw new EntityNotFoundError();
        }

        targetIssue.milestone = null;
        await this.issueRepository.save(targetIssue);

        return targetIssue;
    }

    async getIssues({ issueState, authorName, labelNames, milestoneTitle, assigneeName, page }) {
        const promises = [];

        if (authorName !== undefined) {
            promises.push(this.userRepository.findOne({ name: authorName }));
        } else {
            promises.push(undefined);
        }

        if (labelNames?.length > 0) {
            promises.push(this.labelRepository.createQueryBuilder("label").where("label.name IN (:...labelNames)", { labelNames }).getMany());
        } else {
            promises.push([]);
        }

        if (milestoneTitle !== undefined) {
            promises.push(this.milestoneRepository.findOne({ title: milestoneTitle }));
        } else {
            promises.push(undefined);
        }

        if (assigneeName !== undefined) {
            promises.push(this.userRepository.findOne({ name: assigneeName }));
        } else {
            promises.push(undefined);
        }

        const [author, labels, milestone, assignee] = await Promise.all(promises);

        const query = this.issueRepository
            .createQueryBuilder("issue")
            .orderBy("issue.id", "DESC")
            .offset(page * 25)
            .limit(25);

        if (issueState === ISSUESTATE.OPEN || issueState === ISSUESTATE.CLOSED) {
            query.andWhere("issue.state = :issueState", { issueState });
        }

        if (authorName !== undefined && author !== undefined) {
            query.innerJoinAndSelect("issue.author", "a", "a.deleted_at IS NULL");
            query.andWhere("issue.author_id = :authorId", { authorId: author.id });
        } else if (authorName !== undefined && author === undefined) {
            return [];
        }

        if (labelNames?.length > 0 && labels.length !== 0) {
            query.innerJoinAndSelect("issue.labelToIssues", "b");
            query.andWhere("b.label_id IN (:...labelIds)", { labelIds: labels.map((label) => label.id) });
        } else if (labelNames?.length > 0 && labels.length === 0) {
            return [];
        }

        if (milestoneTitle !== undefined && milestone !== undefined) {
            query.innerJoinAndSelect("issue.milestone", "c", "c.deleted_at IS NULL");
            query.andWhere("issue.milestone_id = :milestoneId", { milestoneId: milestone.id });
        } else if (milestoneTitle !== undefined && milestone === undefined) {
            return [];
        }

        if (assigneeName !== undefined && assignee !== undefined) {
            query.innerJoinAndSelect("issue.userToIssues", "d");
            query.andWhere("d.user_id = :assigneeId", { assigneeId: assignee.id });
        } else if (assigneeName !== undefined && assignee === undefined) {
            return [];
        }

        const issueIds = (await query.getMany()).map((issue) => issue.id);

        const issues = await this.issueRepository
            .createQueryBuilder("issue")
            .leftJoinAndSelect("issue.author", "a")
            .leftJoinAndSelect("issue.labelToIssues", "b")
            .leftJoinAndSelect("b.label", "b_0")
            .leftJoinAndSelect("issue.milestone", "c")
            .leftJoinAndSelect("issue.userToIssues", "d")
            .leftJoinAndSelect("d.user", "d_0")
            .where("issue.id IN (:...issueIds)", { issueIds })
            .orderBy("issue.id", "DESC")
            .getMany();

        return issues;
    }

    @Transactional()
    async getIssueByIdWithRelation(issueId) {
        const issue = await this.issueRepository
            .createQueryBuilder("issue")
            .leftJoinAndSelect("issue.author", "a")
            .leftJoinAndSelect("issue.labelToIssues", "b")
            .leftJoinAndSelect("b.label", "b_0")
            .leftJoinAndSelect("issue.milestone", "c")
            .leftJoinAndSelect("issue.userToIssues", "d")
            .leftJoinAndSelect("d.user", "d_0")
            .leftJoinAndSelect("issue.comments", "e", "e.deleted_at IS NULL")
            .leftJoinAndSelect("e.user", "e_0")
            .leftJoinAndSelect("e.content", "e_1")
            .leftJoinAndSelect("issue.content", "f")
            .where("issue.id = :issueId", { issueId })
            .getOne();

        return issue;
    }
}

export { IssueService };
