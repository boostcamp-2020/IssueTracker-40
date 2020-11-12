import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { agent } from "supertest";
import { TransactionWrapper } from "../TransactionWrapper";
import { ApplicationFactory } from "../../src/application-factory";
import { generateJWTToken } from "../../src/common/lib/token-generator";
import { IssueService } from "../../src/service/issue-service";

const mockUsers = [
    { id: 1, email: "newtest1@test.com", name: "테스터테스터1", password: "test123!@#", profileImage: "profile image" },
    { id: 2, email: "newtest2@test.com", name: "테스터테스터2", password: "test123!@#", profileImage: "profile image" },
    { id: 3, email: "newtest3@test.com", name: "테스터테스터3", password: "test123!@#", profileImage: "profile image" },
    { id: 4, email: "newtest4@test.com", name: "테스터테스터4", password: "test123!@#", profileImage: "profile image" }
];
const mockIssues = [
    { userId: 1, title: "issue title", content: "issue content" },
    { userId: 2, title: "issue title2", content: "issue content2" }
];

describe("User Router Test", () => {
    let app = null;

    beforeAll(async () => {
        app = await ApplicationFactory.create();
    });

    test("로그인한 사용자가 모든 유저 정보를 조회할 수 있다", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const promises = mockUsers.map(({ email, name, password }) =>
                agent(app.httpServer).post(`/auth/signup`).send({
                    email,
                    name,
                    password
                })
            );
            await Promise.all(promises);

            const token = generateJWTToken({
                userId: mockUsers[0].id,
                username: mockUsers[0].name,
                email: mockUsers[0].email,
                photos: mockUsers[0].profileImage
            });

            // when
            const response = await agent(app.httpServer)
                .get(`/api/user`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(200);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("로그인한 모든 이슈 작성자(Author)를 조회할 수 있다", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const promises = mockUsers.map(({ email, name, password }) =>
                agent(app.httpServer).post(`/auth/signup`).send({
                    email,
                    name,
                    password
                })
            );
            await Promise.all(promises);

            const token = generateJWTToken({
                userId: mockUsers[0].id,
                username: mockUsers[0].name,
                email: mockUsers[0].email,
                photos: mockUsers[0].profileImage
            });

            await agent(app.httpServer)
                .post(`/api/issue`)
                .set("Cookie", [`token=${token}`])
                .send({
                    title: mockIssues[0].title,
                    content: mockIssues[0].content
                });

            // when
            const response = await agent(app.httpServer)
                .get(`/api/user?type=author`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(200).toEqual(200);
            expect(response.body.users[0].name).toBe(mockUsers[0].name);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("로그인한 모든 Assignee를 조회할 수 있다", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const promises = mockUsers.map(({ email, name, password }) =>
                agent(app.httpServer).post(`/auth/signup`).send({
                    email,
                    name,
                    password
                })
            );
            await Promise.all(promises);

            const token = generateJWTToken({
                userId: mockUsers[0].id,
                username: mockUsers[0].name,
                email: mockUsers[0].email,
                photos: mockUsers[0].profileImage
            });

            await agent(app.httpServer)
                .post(`/api/issue`)
                .set("Cookie", [`token=${token}`])
                .send({
                    title: mockIssues[0].title,
                    content: mockIssues[0].content
                });

            await agent(app.httpServer)
                .post(`/api/issue/1/assignee/1`)
                .set("Cookie", [`token=${token}`])
                .send();

            // when
            const response = await agent(app.httpServer)
                .get(`/api/user?type=assignee`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(200);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
