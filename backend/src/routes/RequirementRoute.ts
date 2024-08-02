import { Router } from "express";
import RequirementController from "../controllers/RequirementController";
import accessMiddleware from "../middleware/AccessMiddleware";

const requirementController = new RequirementController();

const router = Router();

router.post(
	"/create",
	accessMiddleware(["Company"], 0),
	requirementController.create /** #swagger.tags = ['Requirement'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/internship/:id",
	accessMiddleware("all"),
	requirementController.internship /** #swagger.tags = ['Requirement'] #swagger.security = [{"bearerAuth": []}] */,
);

router.patch(
	"/edit/:id",
	accessMiddleware(["Company"]),
	requirementController.edit /** #swagger.tags = ['Requirement'] #swagger.security = [{"bearerAuth": []}] */,
);

router.delete(
	"/delete/:id",
	accessMiddleware(["Company"], 0),
	requirementController.delete /** #swagger.tags = ['Requirement'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
