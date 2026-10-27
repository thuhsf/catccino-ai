import type { Request, Response } from "express";
import { CategoryFactory } from "@repositories/CategoryRepository.js";
import { makeListCategory } from "@use-cases/factories/category/makeList.js";

async function ListCategoryController(req: Request, res: Response) {
    try {

        const factory = new CategoryFactory();
        const listCategory = makeListCategory(factory);

        const category = await listCategory.execute();

        return res.status(200).json({ ...category });


    } catch (err: Error | any) {
        console.error(err);

        return res.status(400).json({
            error: err.message,
        });
    };
};

export { ListCategoryController };
