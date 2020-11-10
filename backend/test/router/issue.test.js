import { agent } from "supertest";
import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { Application } from "../../src/application";
import { ApplicationFactory } from "../../src/application-factory";
import { ErrorCode } from "../../src/common/error/error-code";
import { generateJWTToken } from "../../src/common/lib/token-generator";
import { Label } from "../../src/model/label";
import { Milestone } from "../../src/model/milestone";
import { User } from "../../src/model/user";
import { TransactionWrapper } from "../TransactionWrapper";

describe("Issue Router Test", () => {
    let app = null;

    beforeAll(async () => {
        app = await ApplicationFactory.create();
    });

    test("사용자가 assignees, labels, milestone 없이 정상적인 POST /api/issue 호출했을 때 HTTP 상태 코드 201", async () => {
        await TransactionWrapper.transaction(async () => {
            // given
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");
            const user = entityManager.create(User, { email: "youngxpepp@gmail.com", name: "youngxpepp", profileImage: "profile image" });
            await entityManager.save(User, user);
            const token = generateJWTToken({
                userId: user.id,
                username: user.name,
                email: user.email,
                photos: user.profileImage
            });

            // when
            const response = await agent(app.httpServer)
                .post("/api/issue")
                .set("Cookie", [`token=${token}`])
                .send({
                    title: "issue title",
                    content: "issue content"
                });

            // then
            expect(response.status).toEqual(201);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("인증되지 않은 사용자가 assignees, labels, milestone 없이 정상적인 POST /api/issue 호출했을 때 HTTP 상태 코드 401", async () => {
        await TransactionWrapper.transaction(async () => {
            // given
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");
            const user = entityManager.create(User, { email: "youngxpepp@gmail.com", name: "youngxpepp", profileImage: "profile image" });
            await entityManager.save(User, user);
            const token = generateJWTToken({
                userId: user.id,
                username: user.name,
                email: user.email,
                photos: user.profileImage
            });

            // when
            const response = await agent(app.httpServer).post("/api/issue").send({
                title: "issue title",
                content: "issue content"
            });

            // then
            expect(response.status).toEqual(401);
            expect(response.body).toEqual({
                error: {
                    code: ErrorCode.UNAUTHORIZED.code,
                    message: ErrorCode.UNAUTHORIZED.message
                }
            });

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("사용자가 assignees, labels, milestone 함께 정상적인 POST /api/issue 호출했을 때 HTTP 상태 코드 201", async () => {
        await TransactionWrapper.transaction(async () => {
            // given
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            const user2 = entityManager.create(User, { email: "youngxpepp2@gmail.com", name: "youngxpepp2", profileImage: "profile image" });
            const user3 = entityManager.create(User, { email: "youngxpepp3@gmail.com", name: "youngxpepp3", profileImage: "profile image" });
            await entityManager.save(User, [user1, user2, user3]);

            const label1 = entityManager.create(Label, { name: "label1", color: "#000000", description: "description" });
            const label2 = entityManager.create(Label, { name: "label2", color: "#000000", description: "description" });
            const label3 = entityManager.create(Label, { name: "label3", color: "#000000", description: "description" });
            await entityManager.save(Label, [label1, label2, label3]);

            const milestone = entityManager.create(Milestone, { title: "title", description: "description" });
            await entityManager.save(Milestone, milestone);
            const token = generateJWTToken({
                userId: user1.id,
                username: user1.name,
                email: user1.email,
                photos: user1.profileImage
            });

            // when
            const response = await agent(app.httpServer)
                .post("/api/issue")
                .set("Cookie", [`token=${token}`])
                .send({
                    title: "issue title",
                    content: "issue content",
                    assignees: [user2.id, user3.id],
                    labels: [label1.id, label2.id, label3.id],
                    milestone: milestone.id
                });

            // then
            expect(response.status).toEqual(201);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
