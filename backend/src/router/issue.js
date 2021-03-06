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
    IssueMilestoneRequestParams,
    GetIssuesRequestQuery,
    GetIssueByIdParams,
    ModifyIssueByIdBody,
    ModifyIssueByIdParams,
    RemoveIssueByIdParams
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

router.patch(
    "/:issueId",
    transformer([RequestType.BODY, RequestType.PARAMS], [ModifyIssueByIdBody, ModifyIssueByIdParams]),
    validator([RequestType.BODY, RequestType.PARAMS]),
    issueController.modifyIssueById
);

router.delete(
    "/:issueId",
    transformer([RequestType.PARAMS], [RemoveIssueByIdParams]),
    validator([RequestType.PARAMS]),
    issueController.removeIssueById
);

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

router.post(
    "/:issueId/milestone/:milestoneId",
    transformer([RequestType.PARAMS], [IssueMilestoneRequestParams]),
    validator([RequestType.PARAMS]),
    issueController.addMilestone
);

router.delete(
    "/:issueId/milestone/:milestoneId",
    transformer([RequestType.PARAMS], [IssueMilestoneRequestParams]),
    validator([RequestType.PARAMS]),
    issueController.removeMilestone
);

export default router;
