import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { Application } from "../../src/application";
import { ISSUESTATE } from "../../src/common/type";
import { Issue } from "../../src/model/issue";
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

    test("정상적인 사용자가 필터 조건 없이 issue 목록 조회", async () => {
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

    test("정상적인 사용자가 open issue, closed issue 목록 조회", async () => {
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

    test("정상적인 사용자가 authorName으로 issue 목록 조회", async () => {
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

    test("정상적인 사용자가 labelName으로 issue 목록 조회", async () => {
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
                        labelIds: [label1.id],
                        milestoneIds: []
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
                        labelIds: [label2.id],
                        milestoneIds: []
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
                        labelIds: [label3.id],
                        milestoneIds: []
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

    test("정상적인 사용자가 milestoneTitle으로 issue 목록 조회", async () => {
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

    test("정상적인 사용자가 assigneeName으로 issue 목록 조회", async () => {
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
});
