import { agent } from "supertest";
import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { ApplicationFactory } from "../../src/application-factory";
import { TransactionWrapper } from "../TransactionWrapper";
import { generateJWTToken } from "../../src/common/lib/token-generator";
import { User } from "../../src/model/user";
import { Issue } from "../../src/model/issue";
import { Milestone } from "../../src/model/milestone";

const mockUser = { email: "Do-ho@github.com", name: "Do-ho", profileImage: "profile image" };
const mockIssue = { title: "issue title" };
const mockMilestone = { title: "title", description: "description", due_date: new Date() };

describe("Comment Router Test", () => {
    let app = null;

    beforeAll(async () => {
        app = await ApplicationFactory.create();
    });

    test("이슈 마일스톤 생성 라우팅 테스트", async () => {
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

            const milestone = entityManager.create(Milestone, mockMilestone);
            await entityManager.save(Milestone, milestone);

            // when
            const response = await agent(app.httpServer)
                .post(`/api/issue/${issue.id}/milestone/${milestone.id}`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(201);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("이슈 마일스톤 삭제 라우팅 테스트", async () => {
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

            const milestone = entityManager.create(Milestone, mockMilestone);
            await entityManager.save(Milestone, milestone);

            // when
            const response = await agent(app.httpServer)
                .delete(`/api/issue/${issue.id}/milestone/${milestone.id}`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(204);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
