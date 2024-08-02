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
	accessMiddleware(["Employee"]),
	studentController.base /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/:id",
	accessMiddleware(["Employee"]),
	studentController.cursor /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/signup",
	accessMiddleware(["Employee"], 1),
	studentController.signup /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/account",
	accessMiddleware(["Student"]),
	studentController.account /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/document",
	accessMiddleware(["Student"]),
	upload("documents"),
	studentController.createDocument /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/image",
	accessMiddleware(["Student"]),
	upload("images"),
	studentController.uploadImage /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.delete(
	"/delete/:id",
	accessMiddleware(["Employee"], 1),
	studentController.delete /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/count",
	accessMiddleware(["Employee"]),
	studentController.count /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/:id",
	accessMiddleware(["Company", "Employee", "Mentor"]),
	studentController.single /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */,
);
export default router;
