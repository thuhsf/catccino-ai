import type { Request, Response } from "express";
import loginSchema from "@entities/auth/schemas/loginSchema.js";
import { AuthFactory } from "@repositories/AuthRepository.js";
import { CustomerGateway } from "@services/CustomerGateway.js";
import { makeLogin } from "@use-cases/factories/auth/makeLogin.js";

async function LoginController(req: Request, res: Response) {
    try {
        const data = loginSchema.parse(req.body);

        const factory = new AuthFactory();
        const customerGateway = new CustomerGateway();
        const login = makeLogin(factory, customerGateway);

        const result = await login.execute(data);

        return res.status(200).json({
            message: "Login realizado com sucesso",
            status: 200,
            ...result,
        });
    } catch (err: any) {
        console.error(err);
        return res.status(401).json({ error: err.message });
    }
}

export { LoginController };
