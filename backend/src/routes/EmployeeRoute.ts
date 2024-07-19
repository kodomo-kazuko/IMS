import { Router } from "express";
import EmployeeController from "../controllers/EmployeeController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();
const employeeController = new EmployeeController();

router.post(
  "/signin",
  employeeController.signin /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/image",
  accessMiddleware(["employee"]),
  upload("images"),
  employeeController.uploadImage /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/signup",
  accessMiddleware(["employee"], 0),
  employeeController.signup /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all",
  accessMiddleware(["employee"]),
  employeeController.all /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/account",
  accessMiddleware(["employee"]),
  employeeController.account /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */
);

export default router;
