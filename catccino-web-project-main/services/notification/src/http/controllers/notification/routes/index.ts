import { Router, type IRouter } from "express";
import { FindNotificationController } from "@controllers/notification/FindNotificationController.js";
import { ListNotificationsByOrderController } from "@controllers/notification/ListNotificationsByOrderController.js";

const router: IRouter = Router();

router.get("/notifications/:id", FindNotificationController);
router.get("/notifications/order/:orderId", ListNotificationsByOrderController);

export default router;