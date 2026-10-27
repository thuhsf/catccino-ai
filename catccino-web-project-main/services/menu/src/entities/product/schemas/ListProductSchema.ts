import { z } from "zod";

const listProductQuerySchema = z.object({
    name: z.string().min(4).max(40).optional(),
    available: z.coerce.boolean().optional(),
    categoryId: z.string().optional()
});

export default listProductQuerySchema;
