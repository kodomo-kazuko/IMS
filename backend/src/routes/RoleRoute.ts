import { Router } from "express";
import accessMiddleware from "../middleware/accessMiddleware";
import RoleController from "../controllers/RoleController";

const roleController = new RoleController();

const router = Router();

router;

router.get("/all", accessMiddleware(["employee"]), roleController.all);

router.post("/create", accessMiddleware(["employee"]), roleController.create);

router.patch("/edit");

router.delete("/delete");

export default router;
