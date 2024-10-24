import { Router } from "express";
import RoleController from "../controllers/RoleController";
import accessMiddleware from "../middleware/AccessMiddleware";

const roleController = new RoleController();

const router = Router();

router.get(
	"/all",
	accessMiddleware([{ account: "Employee", access: 0 }]),
	roleController.all /** #swagger.tags = ['Role'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/create",
	accessMiddleware([{ account: "Employee", access: 0 }]),
	roleController.create /** #swagger.tags = ['Role'] #swagger.security = [{"bearerAuth": []}] */,
);

router.patch(
	"/edit",
	accessMiddleware([{ account: "Employee", access: 0 }]),
	roleController.edit /** #swagger.tags = ['Role'] #swagger.security = [{"bearerAuth": []}] */,
);

router.delete(
	"/delete/:id",
	accessMiddleware([{ account: "Employee", access: 0 }]),
	roleController.delete /** #swagger.tags = ['Role'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
