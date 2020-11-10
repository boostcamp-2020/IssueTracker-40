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

export { addIssue };
