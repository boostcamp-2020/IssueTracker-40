import { agent } from "supertest";
import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { ApplicationFactory } from "../../src/application-factory";
import { generateJWTToken } from "../../src/common/lib/token-generator";
import { Label } from "../../src/model/label";
import { User } from "../../src/model/user";
import { Issue } from "../../src/model/issue";
import { LabelToIssue } from "../../src/model/label-to-issue";
import { TransactionWrapper } from "../TransactionWrapper";

describe("IssueLabel Router Test", () => {
    let app = null;

    beforeAll(async () => {
        app = await ApplicationFactory.create();
    });

    test("사용자가 이슈와 라벨을 만들고, 라벨을 이슈에 등록", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, { email: "youngxpepp@gmail.com", name: "youngxpepp", profileImage: "profile image" });
            await entityManager.save(User, user);
            const token = generateJWTToken({
                userId: user.id,
                username: user.name,
                email: user.email,
                photos: user.profileImage
            });

            const issue = entityManager.create(Issue, { title: "issue title", author: user });
            await entityManager.save(Issue, issue);

            const label = entityManager.create(Label, { name: "label name", color: "#000000" });
            await entityManager.save(Label, label);

            // when
            const response = await agent(app.httpServer)
                .post("/api/issue/1/label/1")
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(201);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("사용자가 이슈와 라벨을 만들고, 라벨을 이슈에 등록 후 이슈에서 라벨 삭제", async () => {
        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, { email: "youngxpepp@gmail.com", name: "youngxpepp", profileImage: "profile image" });
            await entityManager.save(User, user);
            const token = generateJWTToken({
                userId: user.id,
                username: user.name,
                email: user.email,
                photos: user.profileImage
            });

            const issueInstance = entityManager.create(Issue, { title: "issue title", author: user });
            await entityManager.save(Issue, issueInstance);

            const labelInstance = entityManager.create(Label, { name: "label name", color: "#000000" });
            await entityManager.save(Label, labelInstance);

            const labelToIssue = entityManager.create(LabelToIssue, { label: labelInstance, issue: issueInstance });
            await entityManager.save(LabelToIssue, labelToIssue);
            // when
            const response = await agent(app.httpServer)
                .delete("/api/issue/1/label/1")
                .set("Cookie", [`token=${token}`])
                .send();

            // then
            expect(response.status).toEqual(204);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
