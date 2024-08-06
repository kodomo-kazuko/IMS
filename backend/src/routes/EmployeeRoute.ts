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
	accessMiddleware([{ account: "Employee" }]),
	upload("images"),
	employeeController.uploadImage /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/signup",
	accessMiddleware([{ account: "Employee", access: 0 }]),
	employeeController.signup /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all",
	accessMiddleware([{ account: "Employee", access: 0 }]),
	employeeController.all /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/account",
	accessMiddleware([{ account: "Employee" }]),
	employeeController.account /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
