import { agent } from "supertest";
import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { ApplicationFactory } from "../../src/application-factory";
import { TransactionWrapper } from "../TransactionWrapper";
import { generateJWTToken } from "../../src/common/lib/token-generator";
import { User } from "../../src/model/user";
import { Issue } from "../../src/model/issue";
import { Comment } from "../../src/model/comment";
import { CommentContent } from "../../src/model/comment-content";

const mockUser = { email: "Do-ho@github.com", name: "Do-ho", profileImage: "profile image" };
const mockIssue = { title: "issue title" };
const mockCommentContent = { content: "comment content" };

describe("Comment Router Test", () => {
    let app = null;

    beforeAll(async () => {
        app = await ApplicationFactory.create();
    });

    test("이슈에 댓글 생성 라우팅 테스트", async () => {
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
                .post(`/api/issue/${issue.id}/comment`)
                .set("Cookie", [`token=${token}`])
                .send({
                    content: "comment Content"
                });

            // then
            expect(response.status).toEqual(201);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("이슈에 댓글 조회 라우팅 테스트", async () => {
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

            const commentContent = entityManager.create(CommentContent, mockCommentContent);
            await entityManager.save(CommentContent, commentContent);

            const comment = entityManager.create(Comment, { user, issue, content: commentContent });
            await entityManager.save(Comment, comment);

            // when
            const response = await agent(app.httpServer)
                .get(`/api/issue/${issue.id}/comment`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(200);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("이슈에 댓글 수정 라우팅 테스트", async () => {
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

            const commentContent = entityManager.create(CommentContent, mockCommentContent);
            await entityManager.save(CommentContent, commentContent);

            const comment = entityManager.create(Comment, { user, issue, content: commentContent });
            await entityManager.save(Comment, comment);

            // when
            const response = await agent(app.httpServer)
                .patch(`/api/issue/${issue.id}/comment/${comment.id}`)
                .set("Cookie", [`token=${token}`])
                .send({
                    content: "Changed comment"
                });

            // then
            expect(response.status).toEqual(200);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("이슈에 댓글 삭제 라우팅 테스트", async () => {
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

            const commentContent = entityManager.create(CommentContent, mockCommentContent);
            await entityManager.save(CommentContent, commentContent);

            const comment = entityManager.create(Comment, { user, issue, content: commentContent });
            await entityManager.save(Comment, comment);

            // when
            const response = await agent(app.httpServer)
                .delete(`/api/issue/${issue.id}/comment/${comment.id}`)
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(204);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
