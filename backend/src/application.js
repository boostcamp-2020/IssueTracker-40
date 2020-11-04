import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import "express-async-errors";
import { validateOrReject } from "class-validator";
import { createConnection } from "typeorm";
import { errorHandler } from "./common/middleware/error-handler";
import { router } from "./router";
import { EnvType } from "./common/env/env-type";
import { DatabaseEnv } from "./common/env/database-env";
import { ConnectionOptionGenerator } from "./common/config/database/connection-option-generator";
import cors from 'cors';
import { authenticator } from './common/lib';

export class Application {
    constructor() {
        this.httpServer = express();
        this.httpServer.use(cors({
            origin: true,
            credentials: true
        }));
        this.httpServer.use(express.json());
        this.httpServer.use(express.urlencoded({ extended: false }));
        this.httpServer.use(router);
        this.httpServer.use(errorHandler);

        this.databaseEnv = null;
        this.connectionOptionGenerator = null;
        this.authenticator = authenticator;
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
            await this.initDatabase();
            this.initAuthenticator();
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
            path: path.join(`${process.cwd()}`+`/.env.${process.env.NODE_ENV}`)
        });

        this.databaseEnv = new DatabaseEnv();
        await validateOrReject(this.databaseEnv);
        this.connectionOptionGenerator = new ConnectionOptionGenerator(this.databaseEnv);
    }

    async initDatabase() {
        await createConnection(this.connectionOptionGenerator.generateConnectionOption());
    }

    initAuthenticator(){
        this.authenticator.setStrategy();
        this.authenticator.initialize(this.httpServer);
    }
}
