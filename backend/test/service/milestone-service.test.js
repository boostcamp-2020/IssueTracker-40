import { getEntityManagerOrTransactionManager } from "typeorm-transactional-cls-hooked";
import { Application } from "../../src/application";
import { MilestoneService } from "../../src/service";
import { TransactionWrapper } from "../TransactionWrapper";
import { User } from "../../src/model/user";
import { EntityAlreadyExist } from "../../src/common/error/entity-already-exist";

const mockUser = { email: "Do-ho@github.com", name: "Do-ho", profileImage: "profile image" };
const mockMilestone = { title: "title", description: "description", due_date: new Date() };
const mockMilestone2 = { title: "title2", description: "description", due_date: new Date() };

describe("MilestoneService Test", () => {
    const app = new Application();

    beforeAll(async () => {
        await app.initEnvironment();
        await app.initDatabase();
    });

    test("정상적으로 마일스톤 추가가 가능한가?", async () => {
        const milestoneService = MilestoneService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            // when
            const milestone = await milestoneService.addMilestone(mockMilestone);

            // then
            const foundMilestone = await milestoneService.milestoneRepository.findOne(milestone.id);

            expect(foundMilestone.id).toEqual(milestone.id);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("동일한 타이틀을 가진 마일스톤을 생성할 수 없는가?", async () => {
        const milestoneService = MilestoneService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            // when
            try {
                await milestoneService.addMilestone(mockMilestone);
                await milestoneService.addMilestone(mockMilestone);
            } catch (error) {
                // then
                expect(error instanceof EntityAlreadyExist);
            }

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("정상적으로 모든 마일스톤 조회가 가능한가?", async () => {
        const milestoneService = MilestoneService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);
            const milestone1 = await milestoneService.addMilestone(mockMilestone);
            const milestone2 = await milestoneService.addMilestone(mockMilestone2);

            // when
            const milestones = await milestoneService.getMilestones();

            const milestonesIds = milestones.reduce((acc, cur) => {
                return [...acc, cur.id];
            }, []);

            // then
            expect(milestonesIds).toContain(milestone1.id, milestone2.id);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("마일스톤이 하나도 없을 때 조회가 가능한가?", async () => {
        const milestoneService = MilestoneService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);

            // when
            const milestones = await milestoneService.getMilestones();

            const milestonesIds = milestones.reduce((acc, cur) => {
                return [...acc, cur.id];
            }, []);

            // then
            expect(milestonesIds).toEqual([]);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });

    test("정상적으로 마일스톤 조회가 가능한가?", async () => {
        const milestoneService = MilestoneService.getInstance();

        await TransactionWrapper.transaction(async () => {
            const entityManager = getEntityManagerOrTransactionManager();
            await entityManager.query("SAVEPOINT STARTPOINT");

            // given
            const user = entityManager.create(User, mockUser);
            await entityManager.save(User, user);
            const milestone = await milestoneService.addMilestone(mockMilestone);

            // when
            const foundMilestone = await milestoneService.getMilestone(milestone.id);

            // then
            expect(milestone.id).toEqual(foundMilestone.id);

            await entityManager.query("ROLLBACK TO STARTPOINT");
        });
    });
});
