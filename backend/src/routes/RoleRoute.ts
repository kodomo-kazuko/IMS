import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
import RoleController from "../controllers/RoleController";

const roleController = new RoleController();

const router = Router();

router.get(
  "/all",
  accessMiddleware(["employee"]),
  roleController.all /** #swagger.tags = ['Role'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/create",
  accessMiddleware(["employee"]),
  roleController.create /** #swagger.tags = ['Role'] #swagger.security = [{"bearerAuth": []}] */
);

router.patch(
  "/edit",
  accessMiddleware(["employee"]),
  roleController.edit /** #swagger.tags = ['Role'] #swagger.security = [{"bearerAuth": []}] */
);

router.delete(
  "/delete/:id",
  accessMiddleware(["employee"]),
  roleController.delete /** #swagger.tags = ['Role'] #swagger.security = [{"bearerAuth": []}] */
);

export default router;
