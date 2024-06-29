import { Router } from "express";
import MajorController from "../controllers/MajorController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const majorController = new MajorController();

router.get("/all", accessMiddleware("all"), majorController.all);

router.post("/create", accessMiddleware(["employee"]), majorController.create);

export default router;
