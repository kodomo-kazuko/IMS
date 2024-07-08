import { Router } from "express";
import MajorController from "../controllers/MajorController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const majorController = new MajorController();

router.get("/all", accessMiddleware("all"), majorController.all /** #swagger.tags = ['Major'] */);

router.post("/create", accessMiddleware(["employee"]), majorController.create /** #swagger.tags = ['Major'] */);

router.patch("/edit", accessMiddleware(["employee"]), majorController.edit /** #swagger.tags = ['Major'] */);

router.delete("/delete/:id", accessMiddleware(["employee"]), majorController.delete /** #swagger.tags = ['Major'] */);

export default router;
