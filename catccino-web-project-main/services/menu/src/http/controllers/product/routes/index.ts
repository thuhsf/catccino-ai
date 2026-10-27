import { Router, type IRouter } from "express";
import { upload } from "@config/multerConfig.js";
import { RegisterProductController } from "@controllers/product/register.controller.js";
import { UpdateProductController } from "@controllers/product/update.controller.js";
import { ListProductControlelr } from "@controllers/product/list.controller.js";
import { FindProductController } from "@controllers/product/find.controller.js";

const router: IRouter = Router();

router.get("/products", ListProductControlelr);

router.get("/products/:id", FindProductController);

router.post("/products", upload.single("img_file"), RegisterProductController);

router.patch("/products/:id", UpdateProductController);


export default router;

