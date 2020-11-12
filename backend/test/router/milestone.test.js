import { agent } from "supertest";
import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { ApplicationFactory } from "../../src/application-factory";
import { TransactionWrapper } from "../TransactionWrapper";
import { generateJWTToken } from "../../src/common/lib/token-generator";
import { Milestone } from "../../src/model/milestone";
import { User } from "../../src/model/user";
import { MilestoneService } from "../../src/service";

const mockUser = { email: "Do-ho@github.com", name: "Do-ho", profileImage: "profile image" };
const mockMilestone = { title: "title", description: "description", dueDate: new Date() };
const mockMilestone2 = { title: "title2", description: "description", dueDate: new Date() };

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

            const milestone = entityManager.create(Milestone, mockMilestone);
            const milestone2 = entityManager.create(Milestone, mockMilestone2);
            await entityManager.save(Milestone, [milestone, milestone2]);

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

    test("마일스톤 제목, 내용, 마감기한을 변경할 수 있다", async () => {
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

            await agent(app.httpServer)
                .post(`/api/milestone`)
                .set("Cookie", [`token=${token}`])
                .send(mockMilestone);

            // when
            const mockUpdateMilestone = { title: "title2", description: "description2", dueDate: new Date() };
            const response = await agent(app.httpServer)
                .patch(`/api/milestone/1`)
                .set("Cookie", [`token=${token}`])
                .send({
                    title: mockUpdateMilestone.title,
                    description: mockUpdateMilestone.description,
                    dueDate: mockUpdateMilestone.dueDate
                });

            // then
            const responseToGet = await agent(app.httpServer)
                .get(`/api/milestone/1`)
                .set("Cookie", [`token=${token}`])
                .send();
            const updatedMilestone = responseToGet.body;

            expect(response.status).toEqual(201);
            expect(mockUpdateMilestone.title).toBe(updatedMilestone.title);
            expect(mockUpdateMilestone.description).toBe(updatedMilestone.description);
            expect(mockUpdateMilestone.dueDate.toISOString()).toBe(updatedMilestone.dueDate);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("마일스톤 상태(open/close)를 변경할 수 있다", async () => {
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

            await agent(app.httpServer)
                .post(`/api/milestone`)
                .set("Cookie", [`token=${token}`])
                .send(mockMilestone);

            // when
            const response = await agent(app.httpServer)
                .patch(`/api/milestone/1`)
                .set("Cookie", [`token=${token}`])
                .send({
                    state: "close"
                });

            // then
            const responseToGet = await agent(app.httpServer)
                .get(`/api/milestone/1`)
                .set("Cookie", [`token=${token}`])
                .send();
            const updatedMilestone = responseToGet.body;

            expect(response.status).toEqual(201);
            expect("close").toBe(updatedMilestone.state);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("존재하지 않는 마일스톤의 제목, 내용, 마감기한을 변경할 수 없다", async () => {
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
            const mockUpdateMilestone = { title: "title2", description: "description2", dueDate: new Date() };
            const response = await agent(app.httpServer)
                .patch(`/api/milestone/1`)
                .set("Cookie", [`token=${token}`])
                .send({
                    title: mockUpdateMilestone.title,
                    description: mockUpdateMilestone.description,
                    dueDate: mockUpdateMilestone.dueDate
                });

            // then
            expect(response.status).toEqual(404);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("마일스톤의 제목, 내용, 마감기한과 상태(open/close)정보를 동시에 변경할 수 없다", async () => {
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

            await agent(app.httpServer)
                .post(`/api/milestone`)
                .set("Cookie", [`token=${token}`])
                .send(mockMilestone);

            // when
            const mockUpdateMilestone = { title: "title2", description: "description2", dueDate: new Date(), state: "close" };
            const response = await agent(app.httpServer)
                .patch(`/api/milestone/1`)
                .set("Cookie", [`token=${token}`])
                .send({
                    title: mockUpdateMilestone.title,
                    description: mockUpdateMilestone.description,
                    dueDate: mockUpdateMilestone.dueDate,
                    state: mockUpdateMilestone.state
                });

            // then
            expect(response.status).toEqual(400);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("마일스톤 수정 요청시 제목 또는 상태정보(open/close)는 반드시 포함되어야한다", async () => {
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

            await agent(app.httpServer)
                .post(`/api/milestone`)
                .set("Cookie", [`token=${token}`])
                .send(mockMilestone);

            // when
            const mockUpdateMilestone = { description: "description2", dueDate: new Date() };
            const response = await agent(app.httpServer)
                .patch(`/api/milestone/1`)
                .set("Cookie", [`token=${token}`])
                .send({
                    description: mockUpdateMilestone.description,
                    dueDate: mockUpdateMilestone.dueDate
                });

            // then
            expect(response.status).toEqual(400);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("로그인한 사용자가 마일스톤을 삭제할 수 있다", async () => {
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

            await agent(app.httpServer)
                .post(`/api/milestone`)
                .set("Cookie", [`token=${token}`])
                .send(mockMilestone);

            // when
            const response = await agent(app.httpServer)
                .delete(`/api/milestone/1`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            const reseponseToGet = await agent(app.httpServer)
                .get(`/api/milestone/1`)
                .set("Cookie", [`token=${token}`])
                .send();

            expect(response.status).toEqual(204);
            expect(reseponseToGet.status).toEqual(404);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("존재하지 않는 마일스톤을 삭제할 수 없다", async () => {
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
                .delete(`/api/milestone/1`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(404);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("이슈에 배정된 마일스톤을 삭제할 수 있다", async () => {
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
                .delete(`/api/milestone/1`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(404);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
