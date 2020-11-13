import express from "express";
import { IsNumberString } from "class-validator";
import { transformer } from "../common/middleware/transformer";
import { validator } from "../common/middleware/validator";
import { RequestType } from "../common/middleware/request-type";
import { labelToIssueController } from "../controller";

class AddLabelToIssueRequest {
    @IsNumberString()
    issueId;

    @IsNumberString()
    labelId;
}

const router = express.Router();

router.post(
    "/issue/:issueId/label/:labelId",
    transformer([RequestType.PARAMS], [AddLabelToIssueRequest]),
    validator([RequestType.PARAMS]),
    labelToIssueController.addLabelToIssue
);

router.delete(
    "/issue/:issueId/label/:labelId",
    transformer([RequestType.PARAMS], [AddLabelToIssueRequest]),
    validator([RequestType.PARAMS]),
    labelToIssueController.removeLabelToIssue
);
export default router;
