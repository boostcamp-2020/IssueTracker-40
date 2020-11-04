import express from "express";
import { JwtAuthenticator } from "../common/lib/authenticator";

const router = express.Router();

router.use("/", JwtAuthenticator.validateAuthorization);

export default router;
