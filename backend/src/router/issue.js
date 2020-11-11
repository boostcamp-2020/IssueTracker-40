import express from "express";
import { RequestType } from "../common/middleware/request-type";
import { transformer } from "../common/middleware/transformer";
import { validator } from "../common/middleware/validator";
import { issueController, commentController } from "../controller";
import {
    AddIssueRequestBody,
    UserToIssueRequestParams,
    CreateReadCommentRequestParams,
    AddCommentRequestBody,
    UpdateDeleteCommentRequestParams
} from "../dto/issue";

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

router.post(
    "/:issueId/comment",
    transformer([RequestType.BODY, RequestType.PARAMS], [AddCommentRequestBody, CreateReadCommentRequestParams]),
    validator([RequestType.BODY, RequestType.PARAMS]),
    commentController.addComment
);

router.get(
    "/:issueId/comment",
    transformer([RequestType.PARAMS], [CreateReadCommentRequestParams]),
    validator([RequestType.PARAMS]),
    commentController.getComments
);

router.patch(
    "/:issueId/comment/:commentId",
    transformer([RequestType.BODY, RequestType.PARAMS], [AddCommentRequestBody, UpdateDeleteCommentRequestParams]),
    validator([RequestType.BODY, RequestType.PARAMS]),
    commentController.changeComment
);

router.delete(
    "/:issueId/comment/:commentId",
    transformer([RequestType.PARAMS], [UpdateDeleteCommentRequestParams]),
    validator([RequestType.PARAMS]),
    commentController.removeComment
);

export default router;
