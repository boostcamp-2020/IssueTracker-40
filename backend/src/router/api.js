import express from "express";
import { JwtAuthenticator } from "../common/lib/authenticator";
import userRouter from "./user";
import labelRouter from "./label";
import issueRouter from "./issue";

const router = express.Router();

router.use("/", JwtAuthenticator.validateAuthorization);
router.use("/user", userRouter);
router.use("/label", labelRouter);
router.use("/issue", issueRouter);

export default router;
