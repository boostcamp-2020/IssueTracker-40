import { Application } from "./application";

export class ApplicationFactory {
    static async create() {
        const application = new Application();
        await application.initialize();
        return application;
    }
}
