import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();
const userController = new UserController();

router.get("/all", (req, res) => userController.index(req, res));

router.post("/create", (req, res) => userController.create(req, res));

export default router;
