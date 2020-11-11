import express from "express";
import { RequestType } from "../common/middleware/request-type";
import { transformer } from "../common/middleware/transformer";
import { validator } from "../common/middleware/validator";
import { LoginRequestBody, SignupRequestBody } from "../dto/auth";
import { JwtAuthenticator } from "../common/lib/authenticator";
import { authController } from "../controller";

const router = express.Router();

router.post("/signup", transformer([RequestType.BODY], [SignupRequestBody]), validator([RequestType.BODY]), authController.signup);

router.post("/login", transformer([RequestType.BODY], [LoginRequestBody]), validator([RequestType.BODY]), authController.login);

router.get("/logout", JwtAuthenticator.validateAuthorization, authController.logout);

export default router;
