import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { Application } from "../../src/application";
import { UserService } from "../../src/service/user-service";
import { TransactionWrapper } from "../TransactionWrapper";
import { LoginRequestBody } from "../../src/dto/auth";
import { User } from "../../src/model/user";
import { BadRequestError } from "../../src/common/error/bad-request-error";
import { EntityNotFoundError } from "../../src/common/error/entity-not-found-error";
import { IssueService } from "../../src/service/issue-service";

const mockUser = { email: "test@test.com", name: "테스터", password: "test123!@#", profileImage: "profile image" };
const mockUsers = [
    {
        email: "test1@test.com",
        name: "테스터1",
        password: "test123!@#"
    },
    {
        email: "test2@test.com",
        name: "테스터2",
        password: "test123!@#"
    },
    {
        email: "test3@test.com",
        name: "테스터3",
        password: "test123!@#"
    },
    {
        email: "test4@test.com",
        name: "테스터4",
        password: "test123!@#"
    }
];
const mockIssues = [
    { userId: 1, title: "issue title", content: "issue content" },
    { userId: 2, title: "issue title2", content: "issue content2" }
];

const mockIssuesAssignee = [
    { assigneeId: 3, issueId: 1 },
    { assigneeId: 4, issueId: 2 }
];

describe("UserService Test", () => {
    const app = new Application();

    beforeAll(async () => {
        await app.initEnvironment();
        await app.initDatabase();
    });

    test("올바른 이메일, 패스워드 정보로 사용자 인증을 통과할 수 있다", async () => {
        const userService = UserService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            await userService.signup({ email: mockUser.email, name: mockUser.name, password: mockUser.password });

            const loginRequestBody = new LoginRequestBody();
            loginRequestBody.email = mockUser.email;
            loginRequestBody.password = mockUser.password;

            // when
            const authenticatedUser = await userService.authenticate(loginRequestBody);

            // then
            expect(authenticatedUser.id).toBe(1);
            expect(authenticatedUser.name).toBe(mockUser.name);
            expect(authenticatedUser.email).toBe(mockUser.email);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("올바르지 않은 이메일, 패스워드 정보는 사용자 인증을 통과할 수 없다", async () => {
        const userService = UserService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await userService.signup(user);

            const loginRequestBody = new LoginRequestBody();
            loginRequestBody.email = "test@test.com";
            loginRequestBody.password = "213141test";

            // when
            try {
                await userService.authenticate(loginRequestBody);
            } catch (error) {
                // then
                expect(error instanceof BadRequestError);
            }

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("가입되어 있지 않은 이메일, 패스워드 정보는 사용자 인증을 통과할 수 없다", async () => {
        const userService = UserService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await userService.signup(user);

            const loginRequestBody = new LoginRequestBody();
            loginRequestBody.email = "testtest@test.com";
            loginRequestBody.password = "213141test";

            // when
            try {
                await userService.authenticate(loginRequestBody);
            } catch (error) {
                // then
                expect(error instanceof EntityNotFoundError);
            }

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("모든 회원을 조회할 수 있다.", async () => {
        const userService = UserService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const promises = mockUsers.map(({ email, name, password }) => userService.signup({ email, name, password }));
            await Promise.all(promises);

            // when
            const users = await userService.getUsers();

            // then
            users.sort((user1, user2) => (user1.name > user2.name ? 1 : -1));
            users.forEach((user, idx) => {
                expect(user.email).toBe(mockUsers[idx].email);
                expect(user.name).toBe(mockUsers[idx].name);
            });

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("Assignee로 배정된 모든 회원을 조회할 수 있다", async () => {
        const userService = UserService.getInstance();
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            let promises = mockUsers.map(({ email, name, password }) => userService.signup({ email, name, password }));
            await Promise.all(promises);

            promises = mockIssues.map(({ userId, title, content }) => issueService.addIssue({ userId, title, content }));
            await Promise.all(promises);

            promises = mockIssuesAssignee.map(({ assigneeId, issueId }) => issueService.addAssignee(assigneeId, issueId));
            await Promise.all(promises);

            // when
            const assignees = await userService.getAssignees();

            // then
            assignees.forEach((assignee, idx) => {
                expect(assignee.id).toBe(mockIssuesAssignee[idx].assigneeId);
                expect(assignee.id).toBe(mockIssuesAssignee[idx].assigneeId);
            });

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("글을 작성한 모든 회원을 조회할 수 있다", async () => {
        const userService = UserService.getInstance();
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            let promises = mockUsers.map(({ email, name, password }) => userService.signup({ email, name, password }));
            await Promise.all(promises);

            promises = mockIssues.map(({ userId, title, content }) => issueService.addIssue({ userId, title, content }));
            await Promise.all(promises);

            // when
            const authors = await userService.getAuthors();

            // then
            authors.forEach((author, idx) => {
                expect(author.id).toBe(mockIssues[idx].userId);
            });

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
