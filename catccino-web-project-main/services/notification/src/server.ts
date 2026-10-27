/**
 * @Attention
 * 
 * Config {serverConfig} centralizada pra facilitar manutenção.
 * Usada no server.ts e no app.ts.
 * 
 */

import http from "node:http";
import { waitForDb } from "@utils/wait-for-db.js";
import { AppServer } from "@/app.js";
import { serverConfig } from "@config/serverConfig.js";
import { consumer } from "@config/kafkaConfig.js";
import { startNotificationConsumer } from "@utils/notificationConsumer.js";

const server = http.createServer(AppServer);

await consumer.connect();
await startNotificationConsumer(consumer);

const PORT = process.env.PORT || 4000;

async function bootstrap() {
    try {
        await waitForDb(
            serverConfig.wait_for_db.retries,
            serverConfig.wait_for_db.delay
        );

        server.listen(Number(PORT), () => {
            console.log(`Ouvindo na porta ${PORT}`);
        });
    } catch (err) {
        console.error("Erro ao iniciar aplicação:", err);
        process.exit(1);
    };
};

bootstrap();