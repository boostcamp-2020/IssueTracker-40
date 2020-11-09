import express from "express";
import { labelController } from "../controller";

const router = express.Router();

router.post("/", labelController.validateAddLabelParam, labelController.addLabel);

export default router;
