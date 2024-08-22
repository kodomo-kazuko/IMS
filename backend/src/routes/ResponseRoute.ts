import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();
import ResponseController from "../controllers/ResponseController";

const responseController = new ResponseController();

router.post(
	"/create-survey",
	accessMiddleware([{ account: "Student" }, { account: "Company" }]),
	responseController.createSurveyResponse /** #swagger.tags = ['Response'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
