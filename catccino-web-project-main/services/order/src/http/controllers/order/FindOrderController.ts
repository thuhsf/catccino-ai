import { makeFindOrder } from "@use-cases/factories/order/makeFind.js";
import { OrderFactory } from "@repositories/OrderRepository.js";
import type { Request, Response } from "express";

async function FindOrderController(req: Request, res: Response) {
    try {
        const id = req.params.id as string | undefined;

        if (!id) {
            throw new Error("Id não reconhecido ou incompleto");
        }

        const factory = new OrderFactory();
        const findOrder = makeFindOrder(factory);

        const order = await findOrder.execute(id);

        return res.status(200).json({ order });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { FindOrderController };
