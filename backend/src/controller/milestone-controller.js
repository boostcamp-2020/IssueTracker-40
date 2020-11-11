import { MilestoneService } from "../service";

const addMilestone = async (req, res, next) => {
    const { title, description, dueDate } = req.body;

    try {
        const milestoneService = MilestoneService.getInstance();
        await milestoneService.addMilestone({ title, description, dueDate });
        res.status(201).end();
    } catch (error) {
        next(error);
    }
};

const getMilestones = async (req, res, next) => {
    try {
        const milestoneService = MilestoneService.getInstance();
        await milestoneService.getMilestones();
        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

const getMilestone = async (req, res, next) => {
    const { milestoneId } = req.params;

    try {
        const milestoneService = MilestoneService.getInstance();
        await milestoneService.getMilestone(milestoneId);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

export { addMilestone, getMilestones, getMilestone };
