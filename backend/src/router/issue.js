import express from "express";
import { RequestType } from "../common/middleware/request-type";
import { transformer } from "../common/middleware/transformer";
import { validator } from "../common/middleware/validator";
import { AddIssueRequestBody } from "../dto/issue";
import { issueController } from "../controller";

const router = express.Router();

router.post("/", transformer([RequestType.BODY], [AddIssueRequestBody]), validator([RequestType.BODY]), issueController.addIssue);

export default router;
