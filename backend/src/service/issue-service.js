import { getRepository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { EntityNotFoundError } from "../common/error/entity-not-found-error";
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

        const issue = this.issueRepository.create({ title, author, milestone, userToIssues, labelToIssues, issueContent });
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
}

export { IssueService };
