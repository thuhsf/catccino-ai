import type { Request, Response } from "express";
import { NotificationFactory } from "@repositories/NotificationRepository.js";
import { makeListNotificationsByOrder } from "@use-cases/factories/notification/makeList.js";

async function ListNotificationsByOrderController(req: Request, res: Response) {
    try {
        const orderId = req.params.orderId as string | undefined;

        if (!orderId) throw new Error("OrderId não reconhecido ou incompleto");

        const factory = new NotificationFactory();
        const list = makeListNotificationsByOrder(factory);

        const notifications = await list.execute(orderId);

        return res.status(200).json({ ...notifications });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { ListNotificationsByOrderController };