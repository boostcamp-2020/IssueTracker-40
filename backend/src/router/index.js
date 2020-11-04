import express from "express";
import apiRouter from "./api";
import oauthRouter from "./oauth";

const router = express.Router();

router.use("/api", apiRouter);
router.use("/oauth", oauthRouter);

export { router };
