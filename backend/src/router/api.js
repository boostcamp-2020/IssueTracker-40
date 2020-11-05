import express from "express";
import { JwtAuthenticator } from "../common/lib/authenticator";
import userRouter from "./user";

const router = express.Router();

router.use("/", JwtAuthenticator.validateAuthorization);
router.use("/user", userRouter);

export default router;
