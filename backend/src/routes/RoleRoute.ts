import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
import RoleController from "../controllers/RoleController";

const roleController = new RoleController();

const router = Router();

router.get("/all/base", accessMiddleware(["employee"]), roleController.base /** #swagger.tags = ['Role'] */);

router.get("/all/:id", accessMiddleware(["employee"]), roleController.cursor /** #swagger.tags = ['Role'] */);

router.post("/create", accessMiddleware(["employee"]), roleController.create /** #swagger.tags = ['Role'] */);

router.patch("/edit");

router.delete("/delete");

export default router;
