import type { Request, Response } from "express";
import { PaymentFactory } from "@repositories/PaymentRepository.js";
import { makeCreatePayment } from "@use-cases/factories/payment/makeCreate.js";
import createPaymentSchema from "@entities/payment/schemas/paymentSchema.js";

async function CreatePaymentController(req: Request, res: Response) {
    try {
        const data = createPaymentSchema.parse(req.body);

        const factory = new PaymentFactory();
        const createPayment = makeCreatePayment(factory);

        const payment = await createPayment.execute(data);

        return res.status(201).json({
            message: "Pagamento criado com sucesso",
            status: 201,
            payment,
        });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { CreatePaymentController };