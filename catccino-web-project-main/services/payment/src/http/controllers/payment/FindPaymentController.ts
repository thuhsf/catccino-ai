import type { Request, Response } from "express";
import { PaymentFactory } from "@repositories/PaymentRepository.js";
import { makeFindPayment } from "@use-cases/factories/payment/makeFind.js";

async function FindPaymentController(req: Request, res: Response) {
    try {
        const id = req.params.id as string | undefined;

        if (!id) throw new Error("Id não reconhecido ou incompleto");

        const factory = new PaymentFactory();
        const findPayment = makeFindPayment(factory);

        const payment = await findPayment.execute(id);

        return res.status(200).json({ payment });
    } catch (err: any) {
        console.error(err);
        return res.status(400).json({ error: err.message });
    }
}

export { FindPaymentController };