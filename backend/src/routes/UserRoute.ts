import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();
const userController = new UserController();

router.get("/", userController.check);

router.get("/check", userController.tokenRenew);

export default router;
