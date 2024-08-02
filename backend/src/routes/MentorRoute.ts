import { Router } from "express";
import MentorController from "../controllers/MentorController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const mentorController = new MentorController();

router.post(
	"/signin",
	mentorController.signin /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/create",
	accessMiddleware(["Company"], 0),
	mentorController.create /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/base",
	accessMiddleware(["Employee", "Company"]),
	mentorController.base /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/:id",
	accessMiddleware(["Employee", "Company"]),
	mentorController.cursor /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */,
);

router.delete(
	"/delete/:id",
	accessMiddleware(["Company"], 0),
	mentorController.delete /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/:id",
	accessMiddleware(["Employee"]),
	mentorController.single /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
