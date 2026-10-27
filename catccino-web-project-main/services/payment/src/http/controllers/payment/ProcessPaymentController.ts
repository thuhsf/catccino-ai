import type { Request, Response } from "express";
import { PaymentFactory } from "@repositories/PaymentRepository.js";
import { makeProcessPayment } from "@use-cases/factories/payment/makeProcess.js";
import { producer } from "@config/kafkaConfig.js";

async function ProcessPaymentController(req: Request, res: Response) {
    try {
        const id = req.params.id as string | undefined;

        if (!id) throw new Error("Id não reconhecido ou incompleto");

        const { transactionId, approved } = req.body;

        const factory = new PaymentFactory();
        const processPayment = makeProcessPayment(factory, producer);

        const payment = await processPayment.execute({
            paymentId: id,
            transactionId,
            approved,
        });

        return res.status(200).json({ payment });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { ProcessPaymentController };