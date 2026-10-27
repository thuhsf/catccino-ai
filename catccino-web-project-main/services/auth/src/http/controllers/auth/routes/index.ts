import { Router, type IRouter } from "express";
import { RegisterController } from "@controllers/auth/RegisterController.js";
import { LoginController } from "@controllers/auth/LoginController.js";
import { MeController } from "@controllers/auth/MeController.js";
import { ensureAuthenticated } from "@middlewares/ensureAuthenticated.js";

const router: IRouter = Router();

router.post("/register", RegisterController);
router.post("/login", LoginController);
router.get("/me", ensureAuthenticated, MeController);

export default router;
