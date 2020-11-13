import { getRepository } from "typeorm";
import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { Application } from "../../src/application";
import { EntityNotFoundError } from "../../src/common/error/entity-not-found-error";
import { ISSUESTATE } from "../../src/common/type";
import { Comment } from "../../src/model/comment";
import { Issue } from "../../src/model/issue";
import { IssueContent } from "../../src/model/issue-content";
import { Label } from "../../src/model/label";
import { Milestone } from "../../src/model/milestone";
import { User } from "../../src/model/user";
import { IssueService } from "../../src/service/issue-service";
import { TransactionWrapper } from "../TransactionWrapper";

describe("IssueService Test", () => {
    const app = new Application();

    beforeAll(async () => {
        await app.initEnvironment();
        await app.initDatabase();
    });

    test("정상적인 사용자가 assignees, labels, milestone 없이 issue 생성", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, { email: "youngxpepp@gmail.com", name: "youngxpepp", profileImage: "profile image" });
            await entityManager.save(User, user);

            // when
            const issue = await issueService.addIssue({ userId: user.id, title: "issue title", content: "issue content" });

            // then
            expect(typeof issue.id).toEqual("number");
            expect(issue.title).toEqual("issue title");

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("정상적인 사용자가 assignees, labels, milestone 함께 issue 생성", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
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

            // when
            const issue = await issueService.addIssue({
                userId: user1.id,
                title: "issue title",
                content: "issue content",
                assigneeIds: [user2.id, user3.id],
                labelIds: [label1.id, label2.id, label3.id],
                milestoneId: milestone.id
            });

            // then
            expect(issue.id).toBeGreaterThanOrEqual(0);
            expect(issue.author.id).toBeGreaterThanOrEqual(0);
            expect(issue.milestone.id).toBeGreaterThanOrEqual(0);
            issue.userToIssues.forEach((userToIssue) => {
                expect(userToIssue.id).toBeGreaterThanOrEqual(0);
            });
            issue.labelToIssues.forEach((labelToIssue) => {
                expect(labelToIssue.id).toBeGreaterThanOrEqual(0);
            });

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("필터 조건 없이 issue 목록 조회", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            await entityManager.save(User, [user1]);

            const issuePromises = [];
            for (let i = 0; i < 56; i++) {
                issuePromises.push(
                    issueService.addIssue({
                        userId: user1.id,
                        title: "issue title",
                        content: "issue content"
                    })
                );
            }
            const issues = await Promise.all(issuePromises);
            issues.sort((a, b) => a.id - b.id);

            // when
            const pagedIssuePromises = [
                issueService.getIssues({ page: 0 }),
                issueService.getIssues({ page: 1 }),
                issueService.getIssues({ page: 2 })
            ];
            const [pagedIssues1, pagedIssues2, pagedIssues3] = await Promise.all(pagedIssuePromises);

            // then
            expect(pagedIssues1).toHaveLength(25);
            expect(pagedIssues2).toHaveLength(25);
            expect(pagedIssues3).toHaveLength(6);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("open issue, closed issue 목록 조회", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            await entityManager.save(User, [user1]);

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
            const issues = await Promise.all(issuePromises);
            issues.sort((a, b) => a.id - b.id);

            // when
            const pagedIssuePromises = [
                issueService.getIssues({ issueState: ISSUESTATE.OPEN, page: 0 }),
                issueService.getIssues({ issueState: ISSUESTATE.CLOSED, page: 0 }),
                issueService.getIssues({ page: 0 })
            ];
            const [openPagedIssues, closedPagedIssues, totalPagedIssues] = await Promise.all(pagedIssuePromises);

            // then
            expect(openPagedIssues).toHaveLength(3);
            expect(closedPagedIssues).toHaveLength(7);
            expect(totalPagedIssues).toHaveLength(10);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("authorName으로 issue 목록 조회", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            const user2 = entityManager.create(User, { email: "youngxpepp2@gmail.com", name: "youngxpepp2", profileImage: "profile image" });
            const user3 = entityManager.create(User, { email: "youngxpepp3@gmail.com", name: "youngxpepp3", profileImage: "profile image" });
            await entityManager.save(User, [user1, user2, user3]);

            const issuePromises = [];
            for (let i = 0; i < 9; i++) {
                const issue = entityManager.create(Issue, {
                    title: "issue title",
                    author: user1,
                    state: ISSUESTATE.OPEN
                });
                issuePromises.push(entityManager.save(Issue, issue));
            }
            for (let i = 0; i < 5; i++) {
                const issue = entityManager.create(Issue, {
                    title: "issue title",
                    author: user2,
                    state: ISSUESTATE.OPEN
                });
                issuePromises.push(entityManager.save(Issue, issue));
            }
            for (let i = 0; i < 6; i++) {
                const issue = entityManager.create(Issue, {
                    title: "issue title",
                    author: user3,
                    state: ISSUESTATE.OPEN
                });
                issuePromises.push(entityManager.save(Issue, issue));
            }
            const issues = await Promise.all(issuePromises);
            issues.sort((a, b) => a.id - b.id);

            // when
            const pagedIssuePromises = [
                issueService.getIssues({ authorName: user1.name, page: 0 }),
                issueService.getIssues({ authorName: user2.name, page: 0 }),
                issueService.getIssues({ authorName: user3.name, page: 0 })
            ];
            const [pagedIssues1, pagedIssues2, pagedIssues3] = await Promise.all(pagedIssuePromises);

            // then
            expect(pagedIssues1).toHaveLength(9);
            expect(pagedIssues2).toHaveLength(5);
            expect(pagedIssues3).toHaveLength(6);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("labelName으로 issue 목록 조회", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            await entityManager.save(User, [user1]);

            const label1 = entityManager.create(Label, { name: "label1", color: "#000000", description: "description" });
            const label2 = entityManager.create(Label, { name: "label2", color: "#000000", description: "description" });
            const label3 = entityManager.create(Label, { name: "label3", color: "#000000", description: "description" });
            await entityManager.save(Label, [label1, label2, label3]);

            const issuePromises = [];
            for (let i = 0; i < 4; i++) {
                issuePromises.push(
                    issueService.addIssue({
                        userId: user1.id,
                        title: "issue title",
                        content: "issue content",
                        assigneeIds: [],
                        labelIds: [label1.id]
                    })
                );
            }
            for (let i = 0; i < 7; i++) {
                issuePromises.push(
                    issueService.addIssue({
                        userId: user1.id,
                        title: "issue title",
                        content: "issue content",
                        assigneeIds: [],
                        labelIds: [label2.id]
                    })
                );
            }
            for (let i = 0; i < 8; i++) {
                issuePromises.push(
                    issueService.addIssue({
                        userId: user1.id,
                        title: "issue title",
                        content: "issue content",
                        assigneeIds: [],
                        labelIds: [label3.id]
                    })
                );
            }
            const issues = await Promise.all(issuePromises);
            issues.sort((a, b) => a.id - b.id);

            // when
            const pagedIssuePromises = [
                issueService.getIssues({ labelNames: [label1.name], page: 0 }),
                issueService.getIssues({ labelNames: [label2.name], page: 0 }),
                issueService.getIssues({ labelNames: [label3.name], page: 0 })
            ];
            const [pagedIssues1, pagedIssues2, pagedIssues3] = await Promise.all(pagedIssuePromises);

            // then
            expect(pagedIssues1).toHaveLength(4);
            expect(pagedIssues2).toHaveLength(7);
            expect(pagedIssues3).toHaveLength(8);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("milestoneTitle으로 issue 목록 조회", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            await entityManager.save(User, [user1]);

            const label1 = entityManager.create(Label, { name: "label1", color: "#000000", description: "description" });
            const label2 = entityManager.create(Label, { name: "label2", color: "#000000", description: "description" });
            const label3 = entityManager.create(Label, { name: "label3", color: "#000000", description: "description" });
            await entityManager.save(Label, [label1, label2, label3]);

            const milestone1 = entityManager.create(Milestone, { title: "milestone title1" });
            const milestone2 = entityManager.create(Milestone, { title: "milestone title2" });
            const milestone3 = entityManager.create(Milestone, { title: "milestone title3" });
            await entityManager.save(Milestone, [milestone1, milestone2, milestone3]);

            const issuePromises = [];
            for (let i = 0; i < 5; i++) {
                issuePromises.push(
                    issueService.addIssue({
                        userId: user1.id,
                        title: "issue title",
                        content: "issue content",
                        assigneeIds: [],
                        labelIds: [],
                        milestoneId: milestone1.id
                    })
                );
            }
            for (let i = 0; i < 6; i++) {
                issuePromises.push(
                    issueService.addIssue({
                        userId: user1.id,
                        title: "issue title",
                        content: "issue content",
                        assigneeIds: [],
                        labelIds: [],
                        milestoneId: milestone2.id
                    })
                );
            }
            for (let i = 0; i < 7; i++) {
                issuePromises.push(
                    issueService.addIssue({
                        userId: user1.id,
                        title: "issue title",
                        content: "issue content",
                        assigneeIds: [],
                        labelIds: [],
                        milestoneId: milestone3.id
                    })
                );
            }
            const issues = await Promise.all(issuePromises);
            issues.sort((a, b) => a.id - b.id);

            // when
            const pagedIssuePromises = [
                issueService.getIssues({ milestoneTitle: milestone1.title, page: 0 }),
                issueService.getIssues({ milestoneTitle: milestone2.title, page: 0 }),
                issueService.getIssues({ milestoneTitle: milestone3.title, page: 0 })
            ];
            const [pagedIssues1, pagedIssues2, pagedIssues3] = await Promise.all(pagedIssuePromises);

            // then
            expect(pagedIssues1).toHaveLength(5);
            expect(pagedIssues2).toHaveLength(6);
            expect(pagedIssues3).toHaveLength(7);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("assigneeName으로 issue 목록 조회", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            const user2 = entityManager.create(User, { email: "youngxpepp2@gmail.com", name: "youngxpepp2", profileImage: "profile image" });
            const user3 = entityManager.create(User, { email: "youngxpepp3@gmail.com", name: "youngxpepp3", profileImage: "profile image" });
            const user4 = entityManager.create(User, { email: "youngxpepp4@gmail.com", name: "youngxpepp4", profileImage: "profile image" });
            await entityManager.save(User, [user1, user2, user3, user4]);

            const issuePromises = [];
            for (let i = 0; i < 4; i++) {
                issuePromises.push(
                    issueService.addIssue({
                        userId: user1.id,
                        title: "issue title",
                        content: "issue content",
                        assigneeIds: [user1.id]
                    })
                );
            }
            for (let i = 0; i < 4; i++) {
                issuePromises.push(
                    issueService.addIssue({
                        userId: user1.id,
                        title: "issue title",
                        content: "issue content",
                        assigneeIds: [user1.id, user2.id]
                    })
                );
            }
            for (let i = 0; i < 4; i++) {
                issuePromises.push(
                    issueService.addIssue({
                        userId: user1.id,
                        title: "issue title",
                        content: "issue content",
                        assigneeIds: [user1.id, user2.id, user3.id]
                    })
                );
            }
            const issues = await Promise.all(issuePromises);
            issues.sort((a, b) => a.id - b.id);

            // when
            const pagedIssuePromises = [
                issueService.getIssues({ assigneeName: user1.name, page: 0 }),
                issueService.getIssues({ assigneeName: user2.name, page: 0 }),
                issueService.getIssues({ assigneeName: user3.name, page: 0 })
            ];
            const [pagedIssues1, pagedIssues2, pagedIssues3] = await Promise.all(pagedIssuePromises);

            // then
            expect(pagedIssues1).toHaveLength(12);
            expect(pagedIssues2).toHaveLength(8);
            expect(pagedIssues3).toHaveLength(4);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("이슈 타이틀 수정", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            await entityManager.save(User, [user1]);

            const content = entityManager.create(IssueContent, { content: "issue content" });
            const issue = entityManager.create(Issue, { title: "issue title", content, author: user1 });
            await entityManager.save(Issue, issue);

            // when
            const newIssue = await issueService.modifyIssueById(issue.id, "modified issue title");

            // then
            expect(newIssue.title).toEqual("modified issue title");

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("이슈 내용 수정", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            await entityManager.save(User, [user1]);

            const content = entityManager.create(IssueContent, { content: "issue content" });
            const issue = entityManager.create(Issue, { title: "issue title", content, author: user1 });
            await entityManager.save(Issue, issue);

            // when
            const newIssue = await issueService.modifyIssueById(issue.id, undefined, "modified issue content");

            // then
            expect(newIssue?.content?.content).toEqual("modified issue content");

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("이슈 상태 수정", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            await entityManager.save(User, [user1]);

            const content = entityManager.create(IssueContent, { content: "issue content" });
            const issue = entityManager.create(Issue, { title: "issue title", content, author: user1 });
            await entityManager.save(Issue, issue);

            // when
            const newIssue = await issueService.modifyIssueById(issue.id, undefined, undefined, ISSUESTATE.CLOSED);

            // then
            expect(newIssue.state).toEqual(ISSUESTATE.CLOSED);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("이슈 삭제", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user1 = entityManager.create(User, { email: "youngxpepp1@gmail.com", name: "youngxpepp1", profileImage: "profile image" });
            await entityManager.save(User, [user1]);

            const label1 = entityManager.create(Label, { name: "label1", color: "#000000", description: "description" });
            await entityManager.save(Label, [label1]);

            const milestone1 = entityManager.create(Milestone, { title: "milestone title1" });
            await entityManager.save(Milestone, [milestone1]);

            const issue = await issueService.addIssue({
                userId: user1.id,
                title: "issue title",
                content: "issue content",
                assigneeIds: [user1.id],
                labelIds: [label1.id],
                milestoneId: milestone1.id
            });

            const comment = entityManager.create(Comment, { user: user1, issue });
            await entityManager.save(comment);

            // when
            await issueService.removeIssueById(issue.id);

            // then
            const deletedIssue = await entityManager.findOne(Issue, issue.id);
            expect(deletedIssue).toBeUndefined();

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("없는 이슈 삭제했을 때 EntityNotFoundError", async () => {
        const issueService = IssueService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            // when
            // then
            try {
                await issueService.removeIssueById(1);
                fail();
            } catch (e) {
                expect(e).toBeInstanceOf(EntityNotFoundError);
            }

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
