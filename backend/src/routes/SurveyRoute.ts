import { Router } from "express";
import SurveyController from "../controllers/SurveyController";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();

const surveyController = new SurveyController();

router.post(
	"/create",
	accessMiddleware([{ account: "Employee", access: 1 }]),
	surveyController.create /** #swagger.tags = ['Survey'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/base",
	accessMiddleware("all"),
	surveyController.base /** #swagger.tags = ['Survey'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/:id",
	accessMiddleware("all"),
	surveyController.cursor /** #swagger.tags = ['Survey'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/:id",
	accessMiddleware("all"),
	surveyController.single /** #swagger.tags = ['Survey'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
