import { LabelToIssueService } from "../service";

const addLabelToIssue = async (req, res, next) => {
    const { labelId, issueId } = req.params;

    try {
        const labelToIssueService = LabelToIssueService.getInstance();
        await labelToIssueService.addLabelToIssue(parseInt(labelId, 10), parseInt(issueId, 10));
        res.status(201).send("insert label-to-issue success");
    } catch (error) {
        next(error);
    }
};

const removeLabelToIssue = async (req, res, next) => {
    const { labelId, issueId } = req.params;

    try {
        const labelToIssueService = LabelToIssueService.getInstance();
        await labelToIssueService.removeLabelToIssue(labelId, issueId);
        res.status(204).send("delete label-to-issue success");
    } catch (error) {
        next(error);
    }
};

export { addLabelToIssue, removeLabelToIssue };
