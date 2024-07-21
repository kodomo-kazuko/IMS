import { Router } from "express";
import FeedbackController from "../controllers/FeedbackController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();
const feedbackController = new FeedbackController();

router.post(
  "/create",
  accessMiddleware(["company", "student", "mentor"]),
  feedbackController.create /** #swagger.tags = ['Feedback'] #swagger.security = [{"bearerAuth": []}] */
);

export default router;
