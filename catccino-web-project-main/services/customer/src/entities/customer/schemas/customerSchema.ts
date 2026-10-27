import { z } from "zod";

const customerSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
});

export default customerSchema;
