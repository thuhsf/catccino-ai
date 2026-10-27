import { OrderFactory } from "@repositories/OrderRepository.js";
import { makeCreateOrder } from "@use-cases/factories/order/makeCreate.js";
import createOrderSchema from "@entities/order/schemas/OrderSchema.js";
import { ProductGateway } from "@services/ProductGateway.js";
import { producer } from "@config/kafkaConfig.js";
import type { Request, Response } from "express";

async function CreateOrderController(req: Request, res: Response) {
    try {
        const data = createOrderSchema.parse(req.body);

        const productApi = new ProductGateway();

        const orderFact = new OrderFactory()
        const createOrder = makeCreateOrder(orderFact, productApi, producer);

        const order = await createOrder.execute(data);

        return res.status(201).json({
            message: "Pedido criado com sucesso",
            status: 201,
            order,
        });

    } catch (err: Error | any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { CreateOrderController }