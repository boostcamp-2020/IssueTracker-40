import { agent } from "supertest";
import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { ApplicationFactory } from "../../src/application-factory";
import { ErrorCode } from "../../src/common/error/error-code";
import { generateJWTToken } from "../../src/common/lib/token-generator";
import { ISSUESTATE } from "../../src/common/type";
import { Comment } from "../../src/model/comment";
import { Issue } from "../../src/model/issue";
import { Label } from "../../src/model/label";
import { Milestone } from "../../src/model/milestone";
import { User } from "../../src/model/user";
import { CommentService } from "../../src/service";
import { IssueService } from "../../src/service/issue-service";
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

    test("GET /api/issue?page=0, GET /api/issue?page=1 호출했을 때, HTTP 상태 코드 200 이슈 목록 응답", async () => {
        await TransactionWrapper.transaction(async () => {
            // given
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            await entityManager.save(User, [user1]);
            const token = generateJWTToken({
                userId: user1.id,
                username: user1.name,
                email: user1.email,
                photos: user1.profileImage
            });

            const label1 = entityManager.create(Label, { name: "label1", color: "#000000", description: "description" });
            await entityManager.save(Label, [label1]);

            const milestone = entityManager.create(Milestone, { title: "title", description: "description" });
            await entityManager.save(Milestone, milestone);

            const issueService = IssueService.getInstance();
            const issuePromises = [];
            for (let i = 0; i < 26; i++) {
                issuePromises.push(
                    issueService.addIssue({
                        userId: user1.id,
                        title: "issue title",
                        content: "issue content",
                        assigneeIds: [user1.id],
                        labelIds: [label1.id],
                        milestoneId: milestone.id
                    })
                );
            }
            await Promise.all(issuePromises);

            // when
            const responsePromises = [
                agent(app.httpServer)
                    .get("/api/issue")
                    .query({ page: 0 })
                    .set("Cookie", [`token=${token}`])
                    .send(),
                agent(app.httpServer)
                    .get("/api/issue")
                    .query({ page: 1 })
                    .set("Cookie", [`token=${token}`])
                    .send()
            ];
            const responses = await Promise.all(responsePromises);

            // then
            expect(responses[0].status).toEqual(200);
            expect(responses[1].status).toEqual(200);
            expect(responses[0].body.issues).toHaveLength(25);
            expect(responses[1].body.issues).toHaveLength(1);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("GET /api/issue?page=0&q=is:open, GET /api/issue?page=0&q=is:closed 호출했을 때, HTTP 상태 코드 200 이슈 목록 응답", async () => {
        await TransactionWrapper.transaction(async () => {
            // given
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            await entityManager.save(User, [user1]);
            const token = generateJWTToken({
                userId: user1.id,
                username: user1.name,
                email: user1.email,
                photos: user1.profileImage
            });

            const issuePromises = [];
            for (let i = 0; i < 3; i++) {
                const issue = entityManager.create(Issue, {
                    title: "issue title",
                    author: user1,
                    state: ISSUESTATE.OPEN
                });
                issuePromises.push(entityManager.save(Issue, issue));
            }
            for (let i = 0; i < 7; i++) {
                const issue = entityManager.create(Issue, {
                    title: "issue title",
                    author: user1,
                    state: ISSUESTATE.CLOSED
                });
                issuePromises.push(entityManager.save(Issue, issue));
            }
            await Promise.all(issuePromises);

            // when
            const responsePromises = [
                agent(app.httpServer)
                    .get("/api/issue")
                    .query({ q: "is:open", page: 0 })
                    .set("Cookie", [`token=${token}`])
                    .send(),
                agent(app.httpServer)
                    .get("/api/issue")
                    .query({ q: "is:closed", page: 0 })
                    .set("Cookie", [`token=${token}`])
                    .send()
            ];
            const responses = await Promise.all(responsePromises);

            // then
            expect(responses[0].status).toEqual(200);
            expect(responses[1].status).toEqual(200);
            expect(responses[0].body.issues).toHaveLength(3);
            expect(responses[1].body.issues).toHaveLength(7);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("GET /api/issue?page=0&q=author: 호출했을 때, HTTP 상태 코드 200 이슈 목록 응답", async () => {
        await TransactionWrapper.transaction(async () => {
            // given
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            const user2 = entityManager.create(User, { email: "youngxpepp2@gmail.com", name: "youngxpepp2", profileImage: "profile image" });
            const user3 = entityManager.create(User, { email: "youngxpepp3@gmail.com", name: "youngxpepp3", profileImage: "profile image" });
            await entityManager.save(User, [user1, user2, user3]);
            const token = generateJWTToken({
                userId: user1.id,
                username: user1.name,
                email: user1.email,
                photos: user1.profileImage
            });

            const issuePromises = [];
            for (let i = 0; i < 1; i++) {
                const issue = entityManager.create(Issue, {
                    title: "issue title",
                    author: user1,
                    state: ISSUESTATE.OPEN
                });
                issuePromises.push(entityManager.save(Issue, issue));
            }
            for (let i = 0; i < 2; i++) {
                const issue = entityManager.create(Issue, {
                    title: "issue title",
                    author: user2,
                    state: ISSUESTATE.OPEN
                });
                issuePromises.push(entityManager.save(Issue, issue));
            }
            for (let i = 0; i < 3; i++) {
                const issue = entityManager.create(Issue, {
                    title: "issue title",
                    author: user3,
                    state: ISSUESTATE.OPEN
                });
                issuePromises.push(entityManager.save(Issue, issue));
            }
            await Promise.all(issuePromises);

            // when
            const responsePromises = [
                agent(app.httpServer)
                    .get("/api/issue")
                    .query({ q: "author:youngxpepp1", page: 0 })
                    .set("Cookie", [`token=${token}`])
                    .send(),
                agent(app.httpServer)
                    .get("/api/issue")
                    .query({ q: "author:youngxpepp2", page: 0 })
                    .set("Cookie", [`token=${token}`])
                    .send(),
                agent(app.httpServer)
                    .get("/api/issue")
                    .query({ q: "author:youngxpepp3", page: 0 })
                    .set("Cookie", [`token=${token}`])
                    .send()
            ];
            const responses = await Promise.all(responsePromises);

            // then
            expect(responses[0].status).toEqual(200);
            expect(responses[1].status).toEqual(200);
            expect(responses[2].status).toEqual(200);
            expect(responses[0].body.issues).toHaveLength(1);
            expect(responses[1].body.issues).toHaveLength(2);
            expect(responses[2].body.issues).toHaveLength(3);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
