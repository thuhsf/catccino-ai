import { Router, type IRouter } from "express";
import { ListTicketsController } from "@controllers/ticket/ListTicketsController.js";
import { FindTicketController } from "@controllers/ticket/FindTicketController.js";
import { UpdateTicketStatusController } from "@controllers/ticket/UpdateTicketStatusController.js";

const router: IRouter = Router();

router.get("/tickets", ListTicketsController);
router.get("/tickets/:id", FindTicketController);
router.patch("/tickets/:id/status", UpdateTicketStatusController);

export default router;