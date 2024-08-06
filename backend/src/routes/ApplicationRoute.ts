import { Router } from "express";
import ApplicationController from "../controllers/ApplicationController";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();

const applicationController = new ApplicationController();

router.get(
	"/types",
	accessMiddleware("all"),
	applicationController.types /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/create/:id",
	accessMiddleware([{ account: "Student" }]),
	applicationController.create /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/base",
	accessMiddleware("all"),
	applicationController.base /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/:id",
	accessMiddleware("all"),
	applicationController.cursor /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/count",
	accessMiddleware([{ access: 1, account: "Employee" }]),
	applicationController.count /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */,
);

router.patch(
	"/approve/:id",
	accessMiddleware([{ access: 0, account: "Company" }]),
	applicationController.approve /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/:id",
	accessMiddleware("all"),
	applicationController.single /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */,
);
export default router;
