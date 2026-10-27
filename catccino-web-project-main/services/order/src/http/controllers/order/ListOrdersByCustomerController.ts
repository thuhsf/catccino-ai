import { makeListOrderByCustomer } from "@use-cases/factories/order/makeList.js";
import { OrderFactory } from "@repositories/OrderRepository.js";
import type { Request, Response } from "express";

async function ListOrdersByCustomerController(req: Request, res: Response) {
    try {
        const customerId = req.params.customerId as string | undefined;

        if (!customerId) {
            throw new Error("CustomerId não reconhecido ou incompleto");
        }

        const factory = new OrderFactory();
        const listOrder = makeListOrderByCustomer(factory);

        const orders = await listOrder.execute(customerId);

        return res.status(200).json({ ...orders });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { ListOrdersByCustomerController };