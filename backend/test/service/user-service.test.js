import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { Application } from "../../src/application";
import { UserService } from "../../src/service/user-service";
import { TransactionWrapper } from "../TransactionWrapper";
import { LoginRequestBody } from "../../src/dto/auth";
import { User } from "../../src/model/user";
import { BadRequestError } from "../../src/common/error/bad-request-error";
import { EntityNotFoundError } from "../../src/common/error/entity-not-found-error";

const mockUser = { email: "test@test.com", name: "테스터", password: "test123!@#", profileImage: "profile image" };

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
            const user = entityManager.create(User, mockUser);
            await userService.signup(user);

            const loginRequestBody = new LoginRequestBody();
            loginRequestBody.email = mockUser.email;
            loginRequestBody.password = mockUser.password;

            // when
            const authenticatedUser = await userService.authenticate(loginRequestBody);

            // then
            expect(authenticatedUser.id).toBe(user.id);
            expect(authenticatedUser.name).toBe(user.name);
            expect(authenticatedUser.password).toBe(user.password);
            expect(authenticatedUser.profileImage).toBe(user.profileImage);

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
});
