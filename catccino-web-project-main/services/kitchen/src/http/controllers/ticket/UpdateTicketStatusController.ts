import type { Request, Response } from "express";
import { KitchenTicketFactory } from "@repositories/KitchenTicketRepository.js";
import { makeUpdateTicketStatus } from "@use-cases/factories/ticket/makeUpdate.js";

async function UpdateTicketStatusController(req: Request, res: Response) {
    try {
        const id = req.params.id as string | undefined;

        if (!id) throw new Error("Id não reconhecido ou incompleto");

        const { action } = req.body;

        if (!action) throw new Error("Action é obrigatório");

        const factory = new KitchenTicketFactory();
        const updateStatus = makeUpdateTicketStatus(factory);

        const ticket = await updateStatus.execute({ id, action });

        return res.status(200).json({ ticket });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { UpdateTicketStatusController };