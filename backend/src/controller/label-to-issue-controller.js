import { LabelToIssueService } from "../service";

const addLabelToIssue = async (req, res, next) => {
    const { labelId, issueId } = req.params;
    try {
        const labelToIssueService = LabelToIssueService.getInstance();
        await labelToIssueService.addLabelToIssue(labelId, issueId);
        res.status(200).send("insert label-to-issue success");
    } catch (error) {
        next(error);
    }
};

export { addLabelToIssue };
