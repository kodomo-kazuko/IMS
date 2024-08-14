import { Router } from "express";
import QuestionController from "../controllers/QuestionController";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();

const questionController = new QuestionController();

router.get(
	"/createMany",
	accessMiddleware("all"),
	questionController.createMany /** #swagger.tags = ['Question'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
