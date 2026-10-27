import type { Request, Response } from "express";
import { CustomerFactory } from "@/repositories/CustomerRepository.js";
import { makeListCustomers } from "@/use-cases/factories/customer/makeList.js";

async function ListCustomersController(req: Request, res: Response) {
    try {
        const factory = new CustomerFactory();
        const listCustomers = makeListCustomers(factory);

        const customers = await listCustomers.execute();

        return res.status(200).json({ customers });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { ListCustomersController };
