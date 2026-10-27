import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(4).max(40),
    description: z.string().min(8).max(300),
    price: z.coerce.number().positive().max(1000),
    categoryId: z.string(),
    available: z.coerce.boolean().optional()
});

export const updateProductSchema = z.object({
    name: z.string().min(4).max(40).optional(),
    description: z.string().min(8).max(300).optional(),
    price: z.coerce.number().positive().max(1000).optional(),
    categoryId: z.string().optional(),
    available: z.coerce.boolean().optional()
});