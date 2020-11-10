import express from "express";
import { RequestType } from "../common/middleware/request-type";
import { transformer } from "../common/middleware/transformer";
import { validator } from "../common/middleware/validator";
import { issueController } from "../controller";
import { AddIssueRequestBody, UserToIssueRequestParams } from "../dto/issue";

const router = express.Router();

router.post("/", transformer([RequestType.BODY], [AddIssueRequestBody]), validator([RequestType.BODY]), issueController.addIssue);

router.post(
    "/:issueId/assignee/:assigneeId",
    transformer([RequestType.PARAMS], [UserToIssueRequestParams]),
    validator([RequestType.PARAMS]),
    issueController.addAssignee
);

router.delete(
    "/:issueId/assignee/:assigneeId",
    transformer([RequestType.PARAMS], [UserToIssueRequestParams]),
    validator([RequestType.PARAMS]),
    issueController.removeAssignee
);

export default router;
