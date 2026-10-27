import type { Request, Response } from "express";
import registerSchema from "@entities/auth/schemas/registerSchema.js";
import { AuthFactory } from "@repositories/AuthRepository.js";
import { CustomerGateway } from "@services/CustomerGateway.js";
import { makeRegister } from "@use-cases/factories/auth/makeRegister.js";

async function RegisterController(req: Request, res: Response) {
    try {
        const data = registerSchema.parse(req.body);

        const factory = new AuthFactory();
        const customerGateway = new CustomerGateway();
        const register = makeRegister(factory, customerGateway);

        const result = await register.execute(data);

        return res.status(201).json({
            message: "Conta criada com sucesso",
            status: 201,
            ...result,
        });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { RegisterController };
