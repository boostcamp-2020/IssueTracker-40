import express from "express";
import { labelController } from "../controller";

const router = express.Router();

router.post("/", labelController.validateLabelParam, labelController.addLabel);
router.get("/", labelController.getLabels);
router.put("/:labelId", labelController.validateLabelParam, labelController.changeLabel);

export default router;
