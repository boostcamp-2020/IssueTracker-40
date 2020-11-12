import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { Application } from "../../src/application";
import { IssueService } from "../../src/service/issue-service";
import { TransactionWrapper } from "../TransactionWrapper";
import { User } from "../../src/model/user";
import { EntityNotFoundError } from "../../src/common/error/entity-not-found-error";

const mockUser = { email: "Do-ho@github.com", name: "Do-ho", profileImage: "profile image" };
const mockIssue = { title: "issue title", content: "issue content입니다." };

describe("IssueAssigneeService Test", () => {
    const app = new Application();

    beforeAll(async () => {
        await app.initEnvironment();
        await app.initDatabase();
    });

    test("정상적인 사용자의 만들어져 있는 이슈에 Assignee 추가", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const issue = await issueService.addIssue({ ...mockIssue, userId: user.id });

            // when
            const issueAssignee = await issueService.addAssignee(user.id, issue.id);

            // then
            const findedIssue = await issueService.issueRepository.findOne({ id: issue.id, relations: ["userToIssues"] });

            const userToIssueIds = findedIssue.userToIssues.reduce((acc, cur) => {
                return [...acc, cur.id];
            }, []);

            expect(userToIssueIds).toContain(issueAssignee.id);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("정상적인 사용자의 만들어져 있는 이슈에 Assignee 삭제", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const issue = await issueService.addIssue({ ...mockIssue, userId: user.id });
            const issueAssignee = await issueService.addAssignee(user.id, issue.id);

            // when
            await issueService.removeAssignee(user.id, issue.id);

            // then
            const findedIssue = await issueService.issueRepository.findOne({ id: issue.id, relations: ["userToIssues"] });

            const userToIssueIds = findedIssue.userToIssues.reduce((acc, cur) => {
                return [...acc, cur.id];
            }, []);

            expect(userToIssueIds).not.toContainEqual(issueAssignee.id);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("정상적인 사용자의 만들어져있지 않은 이슈에 Assignee 추가", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const mockIssueId = Number.MAX_SAFE_INTEGER;

            // when
            try {
                await issueService.addAssignee(user.id, mockIssueId);
            } catch (error) {
                // then
                expect(error instanceof EntityNotFoundError);
            }

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("정상적인 사용자의 만들어져있지 않은 이슈에 Assignee 삭제", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const mockIssueId = Number.MAX_SAFE_INTEGER;

            // when
            try {
                await issueService.removeAssignee(user.id, mockIssueId);
            } catch (error) {
                // then
                expect(error instanceof EntityNotFoundError);
            }

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
