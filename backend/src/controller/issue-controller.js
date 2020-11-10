import { IssueService } from "../service/issue-service";

const addIssue = async (req, res, next) => {
    const { title, content, assignees, labels, milestone } = req.body;
    const issueService = IssueService.getInstance();
    await issueService.addIssue({
        userId: req.user.id,
        title,
        content,
        assigneeIds: assignees,
        labelIds: labels,
        milestoneId: milestone
    });
    res.status(201).end();
};

const addAssignee = async (req, res, next) => {
    const { assigneeId, issueId } = req.params;
    try {
        const issueService = IssueService.getInstance();
        await issueService.addAssignee(assigneeId, issueId);
        res.status(201).end();
    } catch (error) {
        next(error);
    }
};

const removeAssignee = async (req, res, next) => {
    const { assigneeId, issueId } = req.params;
    try {
        const issueService = IssueService.getInstance();
        await issueService.removeAssignee(assigneeId, issueId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export { addIssue, addAssignee, removeAssignee };
