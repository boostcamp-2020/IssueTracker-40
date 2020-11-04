import express from "express";
import { GithubAuthenticator } from "../common/lib/authenticator";

const router = express.Router();

router.get("/github", GithubAuthenticator.redirectToGithub);

router.get("/github/login", GithubAuthenticator.validateState, GithubAuthenticator.sendTokenToClient);

export default router;
