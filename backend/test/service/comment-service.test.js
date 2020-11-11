import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { Application } from "../../src/application";
import { CommentService } from "../../src/service";
import { TransactionWrapper } from "../TransactionWrapper";
import { User } from "../../src/model/user";
import { Issue } from "../../src/model/issue";
import { EntityNotFoundError } from "../../src/common/error/entity-not-found-error";

const mockUser = { email: "Do-ho@github.com", name: "Do-ho", profileImage: "profile image" };
const mockIssue = { title: "issue title" };
const mockComment = { content: "comment Content" };

describe("CommentService Test", () => {
    const app = new Application();

    beforeAll(async () => {
        await app.initEnvironment();
        await app.initDatabase();
    });

    test("댓글 추가 시 Issue와 Comment에 값이 삽입되는가?", async () => {
        const commentService = CommentService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const issue = entityManager.create(Issue, { ...mockIssue, author: user });
            await entityManager.save(Issue, issue);

            // when
            const comment = await commentService.addComment(user.id, issue.id, mockComment.content);

            // then
            const findedIssue = await commentService.issueRepository.findOne({ id: issue.id, relations: ["comments"] });

            const commentToIssueIds = findedIssue.comments.reduce((acc, cur) => {
                return [...acc, cur.id];
            }, []);

            expect(commentToIssueIds).toContain(comment.id);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("댓글 추가 시 Comment와 CommentToContent에 값이 삽입되는가?", async () => {
        const commentService = CommentService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const issue = entityManager.create(Issue, { ...mockIssue, author: user });
            await entityManager.save(Issue, issue);

            // when
            const comment = await commentService.addComment(user.id, issue.id, mockComment.content);

            // then
            const findedComment = await commentService.commentContentRepository.findOne({ id: comment.content.id, relations: ["comment"] });

            expect(findedComment.comment.id).toEqual(comment.id);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("만들어져있지 않은 issue에 Comment가 생성되는가?", async () => {
        const commentService = CommentService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const mockIssueId = Number.MAX_SAFE_INTEGER;

            // when
            try {
                await commentService.addComment(user.id, mockIssueId, mockComment.content);
            } catch (error) {
                // then
                expect(error instanceof EntityNotFoundError);
            }

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("만들어진 이슈에 대한 comment 조회가 가능한가?", async () => {
        const commentService = CommentService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            const issue = entityManager.create(Issue, { ...mockIssue, author: user });
            await entityManager.save(Issue, issue);

            const comment = await commentService.addComment(user.id, issue.id, mockComment.content);

            // when
            const comments = await commentService.getComments(issue.id);

            // then
            const commentsIds = comments.reduce((acc, cur) => {
                return [...acc, cur.id];
            }, []);

            expect(commentsIds).toContain(comment.id);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
