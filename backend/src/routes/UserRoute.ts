import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();
const userController = new UserController();

router.get("/check", (req, res) => userController.checkToken(req, res));

export default router;
