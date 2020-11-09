import express from "express";
import { labelController } from "../controller";

const router = express.Router();

router.post("/", labelController.validateLabelParam, labelController.addLabel);
router.get("/", labelController.getLabels);

export default router;
