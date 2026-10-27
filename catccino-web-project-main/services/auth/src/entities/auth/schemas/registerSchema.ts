import { z } from "zod";

const registerSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    password: z.string().min(6),
});

export default registerSchema;
