import { agent } from "supertest";
import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { ApplicationFactory } from "../../src/application-factory";
import { TransactionWrapper } from "../TransactionWrapper";
import { User } from "../../src/model/user";
import { Issue } from "../../src/model/issue";
import { UserToIssue } from "../../src/model/user-to-issue";
import { generateJWTToken } from "../../src/common/lib/token-generator";

const mockUser = { email: "Do-ho@github.com", name: "Do-ho", profileImage: "profile image" };
const mockIssue = { title: "issue title" };

describe("Issue-user Router Test", () => {
    let app = null;

    beforeAll(async () => {
        app = await ApplicationFactory.create();
    });

    test("사용자가 만든 이슈에 담당자 지정", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const token = generateJWTToken({
                userId: user.id,
                username: user.name,
                email: user.email,
                photos: user.profileImage
            });

            const issue = entityManager.create(Issue, { ...mockIssue, author: user });
            await entityManager.save(Issue, issue);

            // when
            const response = await agent(app.httpServer)
                .post(`/api/issue/${issue.id}/assignee/${user.id}`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(201);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("사용자가 만든 이슈에 담당자 삭제", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const token = generateJWTToken({
                userId: user.id,
                username: user.name,
                email: user.email,
                photos: user.profileImage
            });

            const issue = entityManager.create(Issue, { ...mockIssue, author: user });
            await entityManager.save(Issue, issue);

            const userToIssue = entityManager.create(UserToIssue, { user, issue });
            await entityManager.save(UserToIssue, userToIssue);

            // when
            const response = await agent(app.httpServer)
                .delete(`/api/issue/${issue.id}/assignee/${user.id}`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(204);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("만들어지지 않은 이슈나 담당자에 대한 이슈 담당자 생성", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const token = generateJWTToken({
                userId: user.id,
                username: user.name,
                email: user.email,
                photos: user.profileImage
            });

            const mockIssueId = Number.MAX_SAFE_INTEGER;

            // when
            const response = await agent(app.httpServer)
                .post(`/api/issue/${mockIssueId}/assignee/${user.id}`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(404);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
    test("만들어지지 않은 이슈나 담당자에 대한 이슈 담당자 삭제", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const token = generateJWTToken({
                userId: user.id,
                username: user.name,
                email: user.email,
                photos: user.profileImage
            });

            const mockIssueId = Number.MAX_SAFE_INTEGER;

            // when
            const response = await agent(app.httpServer)
                .delete(`/api/issue/${mockIssueId}/assignee/${user.id}`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(404);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
