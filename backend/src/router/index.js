import express from "express";
import apiRouter from "./api";

const router = express.Router();

router.get("/", (req, res, next) => {
    res.send("index");
});

router.use("/api", apiRouter);

export { router };
