import customerSchema from "@/entities/customer/schemas/customerSchema.js";
import { CustomerFactory } from "@/repositories/CustomerRepository.js";
import { makeCreateCustomer } from "@/use-cases/factories/customer/makeCreate.js";
import type { Request, Response } from "express";

async function RegisterCustomerController(req: Request, res: Response) {
    const { name, email, phone } = customerSchema.parse(req.body);

    try {
        const factory = new CustomerFactory();
        const registerCustomer = makeCreateCustomer(factory);

        const customer = await registerCustomer.execute({
            name,
            email,
            phone,
        });
        res.status(201).json({
            message: "Cliente criado com sucesso",
            status: 201,
            ...customer,
        });
    } catch (err: Error | any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { RegisterCustomerController };
