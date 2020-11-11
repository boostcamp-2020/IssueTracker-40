import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { agent } from "supertest";
import { TransactionWrapper } from "../TransactionWrapper";
import { ApplicationFactory } from "../../src/application-factory";
import { User } from "../../src/model/user";
import { crypto } from "../../src/common/lib";
import { generateJWTToken } from "../../src/common/lib/token-generator";

const mockUser = { id: 214, email: "newtest@test.com", name: "테스터테스터", password: "test123!@#", profileImage: "profile image" };

describe("Auth Router Test", () => {
    let app = null;

    beforeAll(async () => {
        app = await ApplicationFactory.create();
    });

    test("올바른 회원가입정보로 회원가입 할 수 있다.", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given //when
            const response = await agent(app.httpServer).post(`/auth/signup`).send({
                email: mockUser.email,
                name: mockUser.name,
                password: mockUser.password
            });

            // then
            expect(response.status).toEqual(200);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("올바르지 않은 회원가입정보는 회원가입 할 수 없다.", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given //when
            const response = await agent(app.httpServer).post(`/auth/signup`).send({
                email: 123,
                name: 230,
                password: mockUser.password
            });

            // then
            expect(response.status).toEqual(400);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("이미 가입되어있는 회원가입정보로 회원가입 할 수 없다.", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const encryptedPassword = await crypto.encrypt(mockUser.password);
            await entityManager.save(User, {
                ...mockUser,
                password: encryptedPassword
            });

            // when
            const response = await agent(app.httpServer).post(`/auth/signup`).send({
                email: mockUser.email,
                name: mockUser.name,
                password: mockUser.password
            });

            // then
            expect(response.status).toEqual(400);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("사용자가 이메일, 패스워드 정보로 로그인 요청을 할 수 있다.", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const encryptedPassword = await crypto.encrypt(mockUser.password);
            await entityManager.save(User, {
                ...mockUser,
                password: encryptedPassword
            });

            // when
            const response = await agent(app.httpServer).post(`/auth/login`).send({
                email: mockUser.email,
                password: mockUser.password
            });

            // then
            expect(response.status).toEqual(200);
            expect(response.headers["set-cookie"][0]).toMatch(/^token+/);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("올바르지 않은 이메일, 패스워드 정보는 로그인 요청을 할 수 없다.", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const encryptedPassword = await crypto.encrypt(mockUser.password);
            await entityManager.save(User, {
                ...mockUser,
                password: encryptedPassword
            });

            // when
            const response = await agent(app.httpServer).post(`/auth/login`).send({
                email: "newtest@test.com",
                password: "test123@#"
            });

            // then
            expect(response.status).toEqual(400);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("가입되어 있지 않은 이메일, 패스워드 정보는 로그인 요청을 할 수 없다.", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given //when
            const response = await agent(app.httpServer).post(`/auth/login`).send({
                email: "empty@test.com",
                password: "test123@#"
            });

            // then
            expect(response.status).toEqual(404);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("로그인한 사용자는 로그아웃 요청을 할 수 있다", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const encryptedPassword = await crypto.encrypt(mockUser.password);
            await entityManager.save(User, {
                ...mockUser,
                password: encryptedPassword
            });

            const token = generateJWTToken({
                userId: mockUser.id,
                username: mockUser.name,
                email: mockUser.email,
                photos: mockUser.profileImage
            });

            // when
            const response = await agent(app.httpServer)
                .get(`/auth/logout`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(200);
            expect(response.headers["set-cookie"][0]).toMatch(/^token=;/);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("로그인하지 않은 사용자는 로그아웃 요청을 할 수 없다", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const encryptedPassword = await crypto.encrypt(mockUser.password);
            await entityManager.save(User, {
                ...mockUser,
                password: encryptedPassword
            });

            // when
            const response = await agent(app.httpServer).get(`/auth/logout`).send();

            // then
            expect(response.status).toEqual(401);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
