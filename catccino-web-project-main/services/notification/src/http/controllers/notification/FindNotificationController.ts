import type { Request, Response } from "express";
import { NotificationFactory } from "@repositories/NotificationRepository.js";
import { makeFindNotification } from "@use-cases/factories/notification/makeFind.js";

async function FindNotificationController(req: Request, res: Response) {
    try {
        const id = req.params.id as string | undefined;

        if (!id) throw new Error("Id não reconhecido ou incompleto");

        const factory = new NotificationFactory();
        const find = makeFindNotification(factory);

        const notification = await find.execute(id);

        return res.status(200).json({ notification });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { FindNotificationController };