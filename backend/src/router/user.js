import express from "express";
import { userController } from "../controller";
import { RequestType } from "../common/middleware/request-type";
import { transformer } from "../common/middleware/transformer";
import { validator } from "../common/middleware/validator";
import { GetUserQuery } from "../dto/user";

const router = express.Router();

router.get("/", transformer([RequestType.QUERY], [GetUserQuery]), validator([RequestType.QUERY]), userController.sendUsers);

router.get("/info", userController.sendUserInfo);

export default router;
