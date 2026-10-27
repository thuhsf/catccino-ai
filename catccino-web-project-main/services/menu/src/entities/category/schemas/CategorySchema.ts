import { z } from "zod";

const categorySchema = z.object({
	name: z.string("Tipo inválido de dado").min(4, ("Quantidade de caracteres incompativel")).max(12, "Ultrapassou a quantidade máxima de caracteres"),
	slug: z.string("Tipo inválido de dado").min(4, ("Quantidade de caracteres incompativel")).max(12, "Ultrapassou a quantidade máxima de caracteres"),
});


export default categorySchema;
