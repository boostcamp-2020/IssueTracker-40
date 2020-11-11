import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { Application } from "../../src/application";
import { IssueService } from "../../src/service";
import { TransactionWrapper } from "../TransactionWrapper";
import { User } from "../../src/model/user";
import { Issue } from "../../src/model/issue";
import { Milestone } from "../../src/model/milestone";
import { EntityNotFoundError } from "../../src/common/error/entity-not-found-error";

const mockUser = { email: "Do-ho@github.com", name: "Do-ho", profileImage: "profile image" };
const mockIssue = { title: "issue title" };
const mockMilestone = { title: "title", description: "description", due_date: new Date() };

describe("issueMilestoneService Test", () => {
    const app = new Application();

    beforeAll(async () => {
        await app.initEnvironment();
        await app.initDatabase();
    });

    test("정상적인 사용자가 만든 이슈에 Milestone 추가", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const issue = entityManager.create(Issue, { ...mockIssue, userId: user.id });
            await entityManager.save(Issue, issue);

            const milestone = entityManager.create(Milestone, mockMilestone);
            await entityManager.save(Milestone, milestone);

            // when
            await issueService.addMilestone(issue.id, milestone.id);

            // then
            const foundIssue = await issueService.issueRepository.findOne({ id: issue.id, relations: ["milestone"] });

            expect(foundIssue.milestone.id).toEqual(milestone.id);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("정상적인 사용자가 만든 이슈에 Milestone 삭제", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const milestone = entityManager.create(Milestone, mockMilestone);
            await entityManager.save(Milestone, milestone);

            const issue = entityManager.create(Issue, { ...mockIssue, userId: user.id });
            issue.milestone = milestone.id;
            await entityManager.save(Issue, issue);

            // when
            await issueService.removeMilestone(issue.id, milestone.id);

            // then
            const foundIssue = await issueService.issueRepository.findOne({ id: issue.id, relations: ["milestone"] });

            expect(foundIssue.milestone).toEqual(null);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("정상적인 사용자가 만든 이슈에 없는 Milestone 추가", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const issue = entityManager.create(Issue, { ...mockIssue, userId: user.id });
            await entityManager.save(Issue, issue);

            const mockMilestoneId = Number.MAX_SAFE_INTEGER;

            // when
            try {
                await issueService.addMilestone(issue.id, mockMilestoneId);
            } catch (error) {
                // then
                expect(error instanceof EntityNotFoundError);
            }
            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("정상적인 사용자가 만든 이슈에 없는 Milestone 제거", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const issue = entityManager.create(Issue, { ...mockIssue, userId: user.id });
            await entityManager.save(Issue, issue);

            const mockMilestoneId = Number.MAX_SAFE_INTEGER;

            // when
            try {
                await issueService.removeMilestone(issue.id, mockMilestoneId);
            } catch (error) {
                // then
                expect(error instanceof EntityNotFoundError);
            }
            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
