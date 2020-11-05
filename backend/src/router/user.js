import express from "express";
import { userController } from "../controller";

const router = express.Router();

router.get("/info", userController.sendUserInfo);

export default router;
