import type { Request, Response } from "express";
import { CategoryFactory } from "@repositories/CategoryRepository.js";
import { makeDeleteCategory } from "@use-cases/factories/category/makeDelete.js";


async function DeleteCategoryController(req: Request, res: Response) {
    try {
        const id = req.params.id as string | undefined;

        if (id == undefined) {
            throw new Error("Id não reconhecido ou incompleto")
        };

        const factory = new CategoryFactory();
        const deleteCategory = makeDeleteCategory(factory);

        const category = await deleteCategory.execute(id);

        return res.status(200).json({
            category: { ...category }
        });


    } catch (err: Error | any) {
        console.error(err);

        return res.status(400).json({
            error: err.message,
        });
    };
};


export { DeleteCategoryController };