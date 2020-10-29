import { ApplicationFactory } from "./application-factory";

async function main() {
    const app = await ApplicationFactory.create();
    await app.listen(process.env.port || 5000);
}

main();
