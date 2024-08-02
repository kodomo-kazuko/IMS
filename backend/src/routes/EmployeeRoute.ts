import { Router } from "express";
import EmployeeController from "../controllers/EmployeeController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();
const employeeController = new EmployeeController();

router.post(
	"/signin",
	employeeController.signin /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/image",
	accessMiddleware(["Employee"]),
	upload("images"),
	employeeController.uploadImage /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/signup",
	accessMiddleware(["Employee"], 0),
	employeeController.signup /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all",
	accessMiddleware(["Employee"]),
	employeeController.all /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/account",
	accessMiddleware(["Employee"]),
	employeeController.account /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
