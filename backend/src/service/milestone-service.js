import { getRepository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { EntityAlreadyExist } from "../common/error/entity-already-exist";
import { EntityNotFoundError } from "../common/error/entity-not-found-error";
import { Milestone } from "../model/milestone";
import { BadRequestError } from "../common/error/bad-request-error";

class MilestoneService {
    static instance = null;

    static getInstance() {
        if (MilestoneService.instance === null) {
            MilestoneService.instance = new MilestoneService();
        }
        return MilestoneService.instance;
    }

    constructor() {
        this.milestoneRepository = getRepository(Milestone);
    }

    @Transactional()
    async addMilestone({ title, description, dueDate }) {
        try {
            const milestone = this.milestoneRepository.create({ title, description, dueDate });
            await this.milestoneRepository.save(milestone);
            return milestone;
        } catch (error) {
            throw new EntityAlreadyExist();
        }
    }

    @Transactional()
    async getMilestone(milestoneId) {
        const milestone = await this.milestoneRepository.findOne(milestoneId);

        if (milestone === undefined) {
            throw new EntityNotFoundError();
        }

        return milestone;
    }

    @Transactional()
    async getMilestones() {
        const milestones = await this.milestoneRepository.find({ relations: ["issues"] });

        return milestones;
    }

    @Transactional()
    async changeMilestone({ milestoneId, title, state, description, dueDate }) {
        const milestone = await this.milestoneRepository.findOne({ id: milestoneId });

        if (!milestone) throw new EntityNotFoundError();
        if ((!state && !title) || (state && title)) throw new BadRequestError();

        if (state) {
            await this.milestoneRepository.save({ ...milestone, state });
            return;
        }

        const fieldsToChange = { title, description, dueDate };
        Object.keys(fieldsToChange).forEach((key) => {
            if (fieldsToChange[`${key}`] !== undefined) milestone[`${key}`] = fieldsToChange[`${key}`];
        });
        await this.milestoneRepository.save(milestone);
    }

    @Transactional()
    async removeMilestone({ milestoneId }) {
        const milestone = await this.milestoneRepository.findOne({ id: milestoneId });
        if (!milestone) throw new EntityNotFoundError();
        await this.milestoneRepository.remove(milestone);
    }
}

export { MilestoneService };
