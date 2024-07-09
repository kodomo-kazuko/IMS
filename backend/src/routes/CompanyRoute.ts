import { Router } from "express";
import CompanyController from "../controllers/CompanyController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const companyController = new CompanyController();

router.post(
  "/signin",
  companyController.signin /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all/base",
  accessMiddleware(["employee"]),
  companyController.base /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all/:id",
  accessMiddleware(["employee"]),
  companyController.cursor /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/signup",
  accessMiddleware(["employee"]),
  companyController.signup /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

router.patch(
  "/approve",
  accessMiddleware(["employee"]),
  companyController.approve /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

export default router;
