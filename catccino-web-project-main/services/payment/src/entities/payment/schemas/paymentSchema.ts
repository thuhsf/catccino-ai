import { z } from "zod";

const createPaymentSchema = z.object({
    orderId: z.string(),
    method: z.enum(["credit_card", "debit_card", "pix"]),
    amount: z.number().positive(),
});

export default createPaymentSchema;