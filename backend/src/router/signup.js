import express from "express";
import { signupController } from "../controller";

const router = express.Router();

router.post("/", signupController.validateSignupParam, signupController.signup);

export default router;
