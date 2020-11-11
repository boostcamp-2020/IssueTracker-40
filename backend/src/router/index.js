import express from "express";
import apiRouter from "./api";
import oauthRouter from "./oauth";
import signupRouter from "./signup";
import authRouter from "./auth";

const router = express.Router();

router.use("/api", apiRouter);
router.use("/oauth", oauthRouter);
router.use("/auth", authRouter);
router.use("/signup", signupRouter);

export { router };
