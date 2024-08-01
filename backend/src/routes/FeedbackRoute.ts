import { Router } from "express";
import FeedbackController from "../controllers/FeedbackController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const feedbackController = new FeedbackController();

router.post(
	"/create",
	accessMiddleware("all"),
	feedbackController.create /** #swagger.tags = ['Feedback'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/base",
	accessMiddleware("all"),
	feedbackController.base /** #swagger.tags = ['Feedback'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/:id",
	accessMiddleware("all"),
	feedbackController.cursor /** #swagger.tags = ['Feedback'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
