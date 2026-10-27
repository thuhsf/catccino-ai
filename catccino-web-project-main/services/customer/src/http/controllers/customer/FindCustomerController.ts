import type { Request, Response } from "express";
import { CustomerFactory } from "@/repositories/CustomerRepository.js";
import { makeFindCustomer } from "@/use-cases/factories/customer/makeFind.js";

async function FindCustomerController(req: Request, res: Response) {
    try {
        const id = req.params.id as string | undefined;

        if (!id) throw new Error("Id não reconhecido ou incompleto");

        const factory = new CustomerFactory();
        const findCustomer = makeFindCustomer(factory);

        const customer = await findCustomer.execute(id);

        return res.status(200).json({ customer });
    } catch (err: any) {
        console.error(err);
        return res.status(404).json({ error: err.message });
    }
}

export default FindCustomerController;
