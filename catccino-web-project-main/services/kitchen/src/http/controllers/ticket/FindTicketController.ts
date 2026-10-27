import type { Request, Response } from "express";
import { KitchenTicketFactory } from "@repositories/KitchenTicketRepository.js";
import { makeFindTicket } from "@use-cases/factories/ticket/makeFind.js";

async function FindTicketController(req: Request, res: Response) {
    try {
        const id = req.params.id as string | undefined;

        if (!id) throw new Error("Id não reconhecido ou incompleto");

        const factory = new KitchenTicketFactory();
        const find = makeFindTicket(factory);

        const ticket = await find.execute(id);

        return res.status(200).json({ ticket });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { FindTicketController };