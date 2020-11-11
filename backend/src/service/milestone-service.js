import { getRepository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { EntityAlreadyExist } from "../common/error/entity-already-exist";
import { EntityNotFoundError } from "../common/error/entity-not-found-error";
import { Milestone } from "../model/milestone";

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
            const milestone = this.milestoneRepository.create({ title, description, due_date: dueDate });
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
        const milestones = await this.milestoneRepository.find();

        return milestones;
    }
}

export { MilestoneService };
