import { Router, type IRouter } from "express";
import { RegisterCustomerController } from "../RegisterCustomerController.js";
import { ListCustomersController } from "../ListCustomersController.js";
import FindCustomerController from "../FindCustomerController.js";
import { ensureAuthenticated } from "@middlewares/ensureAuthenticated.js";

const router: IRouter = Router();

router.post("/customers", RegisterCustomerController);

router.get("/customers", ensureAuthenticated, ListCustomersController);
router.get("/customers/:id", FindCustomerController);

export default router;
