import { Router, type IRouter } from "express";
import { UpdateCategoryController } from "@controllers/category/update.controller.js";
import { RegisterCategoryController } from "@controllers/category/register.controller.js";
import { ListCategoryController } from "@controllers/category/list.controller.js";
import { FindCategoryController } from "@controllers/category/find.controller.js";
import { DeleteCategoryController } from "@controllers/category/delete.controller.js";

const router: IRouter = Router();

router.get("/categories", ListCategoryController);
router.get("/categories/:id", FindCategoryController);

router.post("/categories", RegisterCategoryController);

router.patch("/categories/:id", UpdateCategoryController);

router.delete("/categories/:id", DeleteCategoryController);

export default router;

