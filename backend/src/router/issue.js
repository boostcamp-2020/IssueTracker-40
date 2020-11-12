import express from "express";
import { QueryParser } from "../common/lib";
import { queryMapper } from "../common/middleware/query-mapper";
import { RequestType } from "../common/middleware/request-type";
import { transformer } from "../common/middleware/transformer";
import { validator } from "../common/middleware/validator";
import { issueController, commentController } from "../controller";
import {
    AddIssueRequestBody,
    UserToIssueRequestParams,
    CreateReadCommentRequestParams,
    AddCommentRequestBody,
    UpdateDeleteCommentRequestParams,
    GetIssuesRequestQuery,
    GetIssueByIdParams
} from "../dto/issue";

const router = express.Router();

router.post("/", transformer([RequestType.BODY], [AddIssueRequestBody]), validator([RequestType.BODY]), issueController.addIssue);

router.get(
    "/",
    transformer([RequestType.QUERY], [GetIssuesRequestQuery]),
    validator([RequestType.QUERY]),
    queryMapper(new QueryParser(" ", ":")),
    issueController.getIssues
);

router.get("/:issueId", transformer([RequestType.PARAMS], [GetIssueByIdParams]), validator([RequestType.PARAMS]), issueController.getIssueById);

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
