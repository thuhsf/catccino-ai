import { NotificationFactory } from "@repositories/NotificationRepository.js";
import { makeSendNotification } from "@use-cases/factories/notification/makeSend.js";
import type { Consumer } from "kafkajs";
import type { NotificationChannel, NotificationType } from "@entities/notification/Notification.js";

const DEFAULT_CHANNEL: NotificationChannel = "email";

const TOPIC_TYPE_MAP: Record<string, NotificationType> = {
    "order.created": "order_created",
    "payment.confirmed": "payment_confirmed",
    "payment.rejected": "payment_rejected",
};

async function startNotificationConsumer(consumer: Consumer) {
    await consumer.subscribe({
        topics: ["order.created", "payment.confirmed", "payment.rejected"],
        fromBeginning: false,
    });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            try {
                if (!message.value) return;

                const { orderId } = JSON.parse(message.value.toString());

                if (!orderId) {
                    console.error("[NotificationConsumer] orderId ausente na mensagem");
                    return;
                }

                const type = TOPIC_TYPE_MAP[topic];

                if (!type) {
                    console.error(`[NotificationConsumer] Tipo não mapeado para o tópico: ${topic}`);
                    return;
                }

                const factory = new NotificationFactory();
                const send = makeSendNotification(factory);

                await send.execute({
                    orderId,
                    type,
                    channel: DEFAULT_CHANNEL,
                });

                console.log(`[NotificationConsumer] Notificação "${type}" enviada para o pedido ${orderId}`);
            } catch (err) {
                console.error("[NotificationConsumer] Erro ao processar mensagem:", err);
            }
        },
    });
}

export { startNotificationConsumer };