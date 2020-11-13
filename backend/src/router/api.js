import express from "express";
import { JwtAuthenticator } from "../common/lib/authenticator";
import userRouter from "./user";
import labelRouter from "./label";
import issueRouter from "./issue";
import labelToIssueRouter from "./label-to-issue";
import milestoneRouter from "./milestone";

const router = express.Router();

router.use("/", JwtAuthenticator.validateAuthorization);
router.use("/user", userRouter);
router.use("/label", labelRouter);
router.use("/", labelToIssueRouter);
router.use("/issue", issueRouter);
router.use("/milestone", milestoneRouter);

export default router;
