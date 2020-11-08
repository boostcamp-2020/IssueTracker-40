import express from "express";
import { signupController } from "../controller";

const router = express.Router();

router.post("/", signupController.validateSignupParam, signupController.checkUserSignedUp, signupController.signup);

export default router;
