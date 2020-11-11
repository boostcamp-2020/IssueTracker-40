import express from "express";
import { RequestType } from "../common/middleware/request-type";
import { transformer } from "../common/middleware/transformer";
import { validator } from "../common/middleware/validator";
import { milestoneController } from "../controller";
import { AddMilestoneRequestBody, GetMilestoneRequestParams, ChangeMilestoneRequestBody, ChangeMilestoneRequestParams } from "../dto/milestone";

const router = express.Router();

router.post("/", transformer([RequestType.BODY], [AddMilestoneRequestBody]), validator([RequestType.BODY]), milestoneController.addMilestone);
router.get("/", milestoneController.getMilestones);
router.get(
    "/:milestoneId",
    transformer([RequestType.PARAMS], [GetMilestoneRequestParams]),
    validator([RequestType.PARAMS]),
    milestoneController.getMilestone
);
router.patch(
    "/:milestoneId",
    transformer([RequestType.BODY, RequestType.PARAMS], [ChangeMilestoneRequestBody, ChangeMilestoneRequestParams]),
    validator([RequestType.BODY, RequestType.PARAMS]),
    milestoneController.changeMilestone
);

export default router;
