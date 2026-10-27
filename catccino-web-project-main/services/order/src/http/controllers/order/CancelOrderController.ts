import { MakeCancelOrderUseCase } from "@use-cases/factories/order/makeCancel.js";
import { OrderFactory } from "@repositories/OrderRepository.js";
import type { Request, Response } from "express";

async function CancelOrderController(req: Request, res: Response) {
    try {
        const id = req.params.id as string | undefined;

        if (!id) {
            throw new Error("Id não reconhecido ou incompleto");
        }

        const factory = new OrderFactory();
        const cancelOrder = MakeCancelOrderUseCase(factory);

        const order = await cancelOrder.execute(id);

        return res.status(200).json({ order });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}


export { CancelOrderController };