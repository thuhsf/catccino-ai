import { makeUpdateOrderStatus } from "@use-cases/factories/order/makeUpdate.js";
import { OrderFactory } from "@repositories/OrderRepository.js";
import type { Consumer } from "kafkajs";

async function startOrderConsumer(consumer: Consumer) {
    await consumer.subscribe({ topic: "payment.confirmed", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                if (!message.value) return;

                const { orderId } = JSON.parse(message.value.toString());

                if (!orderId) {
                    console.error("[Consumer] orderId ausente na mensagem");
                    return;
                }

                const factory = new OrderFactory();
                const updateStatus = makeUpdateOrderStatus(factory);

                await updateStatus.execute({ id: orderId, status: "paid" });

                console.log(`[Consumer] Pedido ${orderId} marcado como pago`);
            } catch (err) {
                console.error("[Consumer] Erro ao processar mensagem:", err);
            }
        },
    });
}

export { startOrderConsumer };