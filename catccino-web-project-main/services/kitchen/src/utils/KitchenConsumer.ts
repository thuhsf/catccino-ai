import { KitchenTicketFactory } from "@repositories/KitchenTicketRepository.js";
import { makeCreateTicket } from "@use-cases/factories/ticket/makeCreate.js";
import type { Consumer } from "kafkajs";

async function startKitchenConsumer(consumer: Consumer) {
    await consumer.subscribe({ topic: "order.created", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                if (!message.value) return;

                const { orderId } = JSON.parse(message.value.toString());

                if (!orderId) {
                    console.error("[KitchenConsumer] orderId ausente na mensagem");
                    return;
                }

                const factory = new KitchenTicketFactory();
                const createTicket = makeCreateTicket(factory);

                await createTicket.execute({ orderId });

                console.log(`[KitchenConsumer] Ticket criado para o pedido ${orderId}`);
            } catch (err) {
                console.error("[KitchenConsumer] Erro ao processar mensagem:", err);
            }
        },
    });
}

export { startKitchenConsumer };