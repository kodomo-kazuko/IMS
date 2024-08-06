import { Router } from "express";
import StudentController from "../controllers/StudentController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();
const studentController = new StudentController();

router.post(
	"/signin",
	studentController.signin /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/base",
	accessMiddleware([{ account: "Employee" }]),
	studentController.base /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/:id",
	accessMiddleware([{ account: "Employee" }]),
	studentController.cursor /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/signup",
	accessMiddleware([{ account: "Employee", access: 1 }]),
	studentController.signup /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/account",
	accessMiddleware([{ account: "Student" }]),
	studentController.account /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/document",
	accessMiddleware([{ account: "Student" }]),
	upload("documents"),
	studentController.createDocument /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/image",
	accessMiddleware([{ account: "Student" }]),
	upload("images"),
	studentController.uploadImage /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.delete(
	"/delete/:id",
	accessMiddleware([{ account: "Employee", access: 1 }]),
	studentController.delete /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/count",
	accessMiddleware([{ account: "Employee" }]),
	studentController.count /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/:id",
	accessMiddleware([
		{ account: "Company" },
		{ account: "Employee" },
		{ account: "Mentor" },
	]),
	studentController.single /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);
export default router;
