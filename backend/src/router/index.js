import express from "express";
import { BusinessError } from "../common/error/business-error";
import { ErrorCode } from "../common/error/error-code";

const router = express.Router();

router.get("/", (req, res, next) => {
    res.send("index");
});

export { router };
