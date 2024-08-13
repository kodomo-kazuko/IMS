import { Router } from "express";
import SurveyController from "../controllers/SurveyController";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();

const surveyController = new SurveyController();

router.post(
	"/test" /** #swagger.tags = ['Survey'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
