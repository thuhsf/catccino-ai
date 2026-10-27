import { Router, type IRouter } from "express";
import { CreateOrderController } from "@controllers/order/CreateOrderController.js";
import { FindOrderController } from "@controllers/order/FindOrderController.js";
import { ListOrdersByCustomerController } from "@controllers/order/ListOrdersByCustomerController.js";
import { CancelOrderController } from "@controllers/order/CancelOrderController.js";
import { UpdateOrderStatusController } from "@controllers/order/UpdateOrderStatus.js";

const router: IRouter = Router();

router.get("/orders/:id", FindOrderController);
router.get("/orders/customer/:customerId", ListOrdersByCustomerController);

router.post("/orders", CreateOrderController);

router.patch("/orders/:id/status", UpdateOrderStatusController);
router.patch("/orders/:id/cancel", CancelOrderController);

export default router;
