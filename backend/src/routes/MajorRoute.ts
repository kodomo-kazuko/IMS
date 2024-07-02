import { Router } from "express";
import MajorController from "../controllers/MajorController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const majorController = new MajorController();

router.get("/all", accessMiddleware("all"), majorController.all);

router.post("/create", accessMiddleware(["employee"]), majorController.create);

router.patch("/edit", accessMiddleware(["employee"]), majorController.edit);

router.delete("/delete/:id", accessMiddleware(["employee"]), majorController.delete);

export default router;
