import { agent } from "supertest";
import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { ApplicationFactory } from "../../src/application-factory";
import { TransactionWrapper } from "../TransactionWrapper";
import { generateJWTToken } from "../../src/common/lib/token-generator";
import { Milestone } from "../../src/model/milestone";
import { User } from "../../src/model/user";

const mockUser = { email: "Do-ho@github.com", name: "Do-ho", profileImage: "profile image" };
const mockMilestone = { title: "title", description: "description", dueDate: new Date() };

describe("Milestone Router Test", () => {
    let app = null;

    beforeAll(async () => {
        app = await ApplicationFactory.create();
    });

    test("마일스톤 생성 라우팅 테스트", async () => {
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

            // when
            const response = await agent(app.httpServer)
                .post(`/api/milestone`)
                .set("Cookie", [`token=${token}`])
                .send(mockMilestone);

            // then
            expect(response.status).toEqual(201);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("여러 마일스톤 조회 라우팅 테스트", async () => {
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

            // when
            const response = await agent(app.httpServer)
                .get(`/api/milestone`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(200);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("마일스톤 조회 라우팅 테스트", async () => {
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

            const milestone = entityManager.create(Milestone, mockMilestone);
            await entityManager.save(Milestone, milestone);

            // when
            const response = await agent(app.httpServer)
                .get(`/api/milestone/${milestone.id}`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(200);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
