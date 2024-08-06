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
	accessMiddleware([{ account: "Company", access: 0 }]),
	mentorController.create /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/base",
	accessMiddleware([
		{ account: "Company", access: 0 },
		{ account: "Employee", access: 1 },
	]),
	mentorController.base /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/:id",
	accessMiddleware([
		{ account: "Company", access: 0 },
		{ account: "Employee", access: 1 },
	]),
	mentorController.cursor /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */,
);

router.delete(
	"/delete/:id",
	accessMiddleware([{ account: "Company", access: 0 }]),
	mentorController.delete /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/:id",
	accessMiddleware([
		{ account: "Employee" },
		{ account: "Company", access: 0 },
	]),
	mentorController.single /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
