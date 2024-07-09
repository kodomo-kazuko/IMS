import { Router } from "express";
import EmployeeController from "../controllers/EmployeeController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const employeeController = new EmployeeController();

router.post(
  "/signin",
  employeeController.signin /** #swagger.tags = ['Employee'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/signup",
  accessMiddleware(["employee"]),
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
