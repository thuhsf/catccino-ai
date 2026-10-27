import { z } from "zod";

const createOrderSchema = z.object({
    customerId: z.string(),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive()
    })
    ).min(1, "Pedido deve ter ao menos um item")
});

export default createOrderSchema;