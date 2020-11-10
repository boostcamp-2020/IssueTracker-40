import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { Application } from "../../src/application";
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
});
