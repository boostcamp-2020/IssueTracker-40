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

const getIssues = async (req, res, next) => {
    const { page } = req.query;
    const queryMap = req?.context?.queryMap;
    const issueService = IssueService.getInstance();

    const issues =
        (
            await issueService.getIssues({
                issueState: queryMap?.get("is")?.[0],
                authorName: queryMap?.get("author")?.[0],
                labelNames: queryMap?.get("label"),
                milestoneTitle: queryMap?.get("milestone")?.[0],
                assigneeName: queryMap?.get("assignee")?.[0],
                page
            })
        ).map((issue) => {
            const labels =
                issue?.labelToIssues?.map((labelToIssue) => ({
                    id: labelToIssue?.label?.id,
                    name: labelToIssue?.label?.name,
                    color: labelToIssue?.label?.color
                })) ?? [];
            const assignees =
                issue?.userToIssues?.map((userToIssue) => ({
                    id: userToIssue?.user?.id,
                    name: userToIssue?.user?.name,
                    profileImage: userToIssue?.user?.profileImage
                })) ?? [];

            return {
                id: issue?.id,
                title: issue?.title,
                state: issue?.state,
                createdAt: issue?.createdAt,
                updatedAt: issue?.updatedAt,
                author: {
                    id: issue?.author?.id,
                    name: issue?.author?.name
                },
                labels,
                milestone: {
                    id: issue?.milestone?.id,
                    title: issue?.milestone?.title
                },
                assignees
            };
        }) ?? [];

    res.status(200).send({ issues });
};

const getIssueById = async (req, res, next) => {
    const { issueId } = req.params;
    const issueService = IssueService.getInstance();

    const issue = await issueService.getIssueByIdWithRelation(issueId);

    const labels =
        issue?.labelToIssues?.map((labelToIssue) => ({
            id: labelToIssue?.label?.id,
            name: labelToIssue?.label?.name,
            color: labelToIssue?.label?.color
        })) ?? [];
    const assignees =
        issue?.userToIssues?.map((userToIssue) => ({
            id: userToIssue?.user?.id,
            name: userToIssue?.user?.name,
            profileImage: userToIssue?.user?.profileImage
        })) ?? [];
    const comments = issue?.comments?.map((comment) => ({
        id: comment?.id,
        content: comment?.content?.content,
        createdAt: comment?.createdAt,
        updatedAt: comment?.updatedAt,
        user: {
            id: comment?.user?.id,
            name: comment?.user?.name,
            profileImage: comment?.user?.profileImage
        }
    }));

    res.status(200).send({
        issue: {
            id: issue?.id,
            title: issue?.title,
            content: issue?.content?.content,
            state: issue?.state,
            createdAt: issue?.createdAt,
            updatedAt: issue?.updatedAt,
            author: {
                id: issue?.author?.id,
                name: issue?.author?.name
            },
            labels,
            milestone: {
                id: issue?.milestone?.id,
                title: issue?.milestone?.title
            },
            assignees,
            comments
        }
    });
};

const modifyIssueById = async (req, res, next) => {
    const { issueId } = req.params;
    const { title, content, state } = req.body;

    const issueService = IssueService.getInstance();
    await issueService.modifyIssueById(issueId, title, content, state);

    res.status(204).end();
};

const removeIssueById = async (req, res, next) => {
    const { issueId } = req.params;

    const issueService = IssueService.getInstance();
    await issueService.removeIssueById(issueId);

    res.status(204).end();
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

const addMilestone = async (req, res, next) => {
    const { milestoneId, issueId } = req.params;
    try {
        const issueService = IssueService.getInstance();
        await issueService.addMilestone(milestoneId, issueId);
        res.status(201).end();
    } catch (error) {
        next(error);
    }
};

const removeMilestone = async (req, res, next) => {
    const { milestoneId, issueId } = req.params;
    try {
        const issueService = IssueService.getInstance();
        await issueService.removeMilestone(milestoneId, issueId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export { addIssue, addAssignee, removeAssignee, getIssues, getIssueById, addMilestone, removeMilestone, modifyIssueById, removeIssueById };
