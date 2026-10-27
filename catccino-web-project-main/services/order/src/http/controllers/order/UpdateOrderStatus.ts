import { makeUpdateOrderStatus } from "@use-cases/factories/order/makeUpdate.js";
import { OrderFactory } from "@repositories/OrderRepository.js";
import type { Request, Response } from "express";

async function UpdateOrderStatusController(req: Request, res: Response) {
    try {
        const id = req.params.id as string | undefined;

        if (!id) {
            throw new Error("Id não reconhecido ou incompleto");
        }

        const { status } = req.body;

        if (!status) {
            throw new Error("Status é obrigatório");
        }

        const factory = new OrderFactory();
        const updateStatus = makeUpdateOrderStatus(factory);

        const order = await updateStatus.execute({ id, status });

        return res.status(200).json({ order });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { UpdateOrderStatusController };
