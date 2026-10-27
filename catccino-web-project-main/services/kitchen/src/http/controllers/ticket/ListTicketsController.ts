import type { Request, Response } from "express";
import { KitchenTicketFactory } from "@repositories/KitchenTicketRepository.js";
import { makeListTickets } from "@use-cases/factories/ticket/makeList.js";

async function ListTicketsController(req: Request, res: Response) {
    try {
        const status = req.query.status as string | undefined;

        const factory = new KitchenTicketFactory();
        const list = makeListTickets(factory);

        const tickets = await list.execute(
            status ? { status } : {}
        );

        return res.status(200).json({ ...tickets });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { ListTicketsController };