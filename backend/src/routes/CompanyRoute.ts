import { Router } from "express";
import CompanyController from "../controllers/CompanyController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();
const companyController = new CompanyController();

router.post(
	"/signin",
	companyController.signin /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/base",
	accessMiddleware([{ account: "Employee" }]),
	companyController.base /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/:id",
	accessMiddleware([{ account: "Employee" }]),
	companyController.cursor /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/signup",
	accessMiddleware([{ account: "Employee", access: 1 }]),
	companyController.signup /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */,
);

router.patch(
	"/approve/:id",
	accessMiddleware([{ account: "Employee", access: 1 }]),
	companyController.approve /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/account",
	accessMiddleware([{ account: "Company" }]),
	companyController.account /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/image",
	accessMiddleware([{ account: "Company" }]),
	upload("images"),
	companyController.uploadImage /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/count",
	accessMiddleware([{ account: "Employee" }]),
	companyController.count /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/:id",
	accessMiddleware([{ account: "Employee" }]),
	companyController.single /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
