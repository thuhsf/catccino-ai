import type { Request, Response } from "express";
import { CustomerGateway } from "@services/CustomerGateway.js";

async function MeController(req: Request, res: Response) {
    try {
        const customerId = req.customerId as string;

        const customerGateway = new CustomerGateway();
        const customer = await customerGateway.findCustomerById(customerId);

        if (!customer) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }

        return res.status(200).json({ customer });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { MeController };
