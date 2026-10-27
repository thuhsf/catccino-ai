// utils/MenuConsumer.ts
import type { Consumer } from "kafkajs";

async function startMenuConsumer(consumer: Consumer) {
    await consumer.subscribe({ topic: "order.created", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                if (!message.value) return;

                const { orderId, items } = JSON.parse(message.value.toString());

                console.log(`[MenuConsumer] Pedido ${orderId} recebido com ${items.length} item(s)`);

                // aqui você pode chamar use cases do menu service
                // ex: registrar vendas, atualizar estoque, etc.

            } catch (err) {
                console.error("[MenuConsumer] Erro ao processar mensagem:", err);
            }
        },
    });
}

export { startMenuConsumer };