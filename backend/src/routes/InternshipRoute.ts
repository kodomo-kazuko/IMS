import { Router } from "express";
import InternshipController from "../controllers/InternshipController";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();

const internshipController = new InternshipController();

router.get(
	"/types",
	accessMiddleware("all"),
	internshipController.types /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/create",
	accessMiddleware([{ account: "Company", access: 0 }]),
	internshipController.create /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/base",
	accessMiddleware("all"),
	internshipController.base /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/:id",
	accessMiddleware("all"),
	internshipController.cursor /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/count",
	accessMiddleware([{ account: "Employee" }]),
	internshipController.count /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */,
);

router.delete(
	"/delete/:id",
	accessMiddleware([{ account: "Company", access: 0 }]),
	internshipController.delete /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/:id",
	accessMiddleware("all"),
	internshipController.single /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
