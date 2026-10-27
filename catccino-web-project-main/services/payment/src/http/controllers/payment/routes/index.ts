import { Router, type IRouter } from "express";
import { CreatePaymentController } from "@controllers/payment/CreatePaymentController.js";
import { ProcessPaymentController } from "@controllers/payment/ProcessPaymentController.js";
import { FindPaymentController } from "@controllers/payment/FindPaymentController.js";

const router: IRouter = Router();

router.get("/payments/:id", FindPaymentController);
router.post("/payments", CreatePaymentController);
router.patch("/payments/:id/process", ProcessPaymentController);

export default router;