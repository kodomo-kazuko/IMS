import { Router } from "express";
import StudentInternshipController from "../controllers/StudentInternshipController";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();

const studentInternshipController = new StudentInternshipController();

router.get(
	"/types",
	accessMiddleware("all"),
	studentInternshipController.types /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/base",
	accessMiddleware("all"),
	studentInternshipController.base /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/:id",
	accessMiddleware("all"),
	studentInternshipController.cursor /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/create/:id",
	accessMiddleware([{ account: "Student" }]),
	studentInternshipController.create /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */,
);

router.patch(
	"/start",
	accessMiddleware([{ account: "Company", access: 0 }]),
	studentInternshipController.start /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
