import express from "express";
import { RequestType } from "../common/middleware/request-type";
import { transformer } from "../common/middleware/transformer";
import { validator } from "../common/middleware/validator";
import { addIssue } from "../controller/issue-controller";
import { AddIssueRequestBody } from "../dto/issue";

const router = express.Router();

router.post("/", transformer([RequestType.BODY], [AddIssueRequestBody]), validator([RequestType.BODY]), addIssue);

export default router;
