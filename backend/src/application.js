import "reflect-metadata";
import "express-async-errors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { validateOrReject } from "class-validator";
import { createConnection } from "typeorm";
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from "typeorm-transactional-cls-hooked";
import { errorHandler } from "./common/middleware/error-handler";
import { router } from "./router";
import { EnvType } from "./common/env/env-type";
import { DatabaseEnv } from "./common/env/database-env";
import { ConnectionOptionGenerator } from "./common/config/database/connection-option-generator";
import * as authenticator from "./common/lib/authenticator";

export class Application {
    constructor() {
        this.httpServer = express();
        this.databaseEnv = null;
        this.connectionOptionGenerator = null;
    }

    listen(port) {
        return new Promise((resolve) => {
            this.httpServer.listen(port, () => {
                resolve();
            });
        });
    }

    async initialize() {
        try {
            await this.initEnvironment();
            this.registerMiddleware();
            await this.initDatabase();
            authenticator.initializeAuthenticator(this.httpServer);
        } catch (error) {
            console.error(error);
            process.exit();
        }
    }

    async initEnvironment() {
        dotenv.config();
        if (!EnvType.contains(process.env.NODE_ENV)) {
            throw new Error("잘못된 NODE_ENV 입니다. {production, development, local, test} 중 하나를 선택하십시오.");
        }
        dotenv.config({
            path: path.join(`${process.cwd()}/.env.${process.env.NODE_ENV}`)
        });

        this.databaseEnv = new DatabaseEnv();
        await validateOrReject(this.databaseEnv);
        this.connectionOptionGenerator = new ConnectionOptionGenerator(this.databaseEnv);
    }

    async initDatabase() {
        initializeTransactionalContext();
        patchTypeORMRepositoryWithBaseRepository();
        await createConnection(this.connectionOptionGenerator.generateConnectionOption());
    }

    registerMiddleware() {
        this.httpServer.use(
            cors({
                origin: true,
                credentials: true
            })
        );
        this.httpServer.use(cookieParser());
        this.httpServer.use(express.json());
        this.httpServer.use(express.urlencoded({ extended: false }));
        this.httpServer.use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: true
            })
        );
        this.httpServer.use(router);
        this.httpServer.use(errorHandler);
    }
}
