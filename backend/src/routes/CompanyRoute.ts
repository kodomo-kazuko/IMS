import { Router } from "express";
import CompanyController from "../controllers/CompanyController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

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
  accessMiddleware(["employee"], 1),
  companyController.signup /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

router.patch(
  "/approve",
  accessMiddleware(["employee"], 1),
  companyController.approve /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/account",
  accessMiddleware(["company"], 0),
  companyController.account /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/image",
  accessMiddleware(["company"]),
  upload("images"),
  companyController.uploadImage /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/count",
  accessMiddleware(["employee"]),
  companyController.count /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/score",
  accessMiddleware(["employee"]),
  companyController.score /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/:id",
  accessMiddleware(["employee"]),
  companyController.single /** #swagger.tags = ['Company'] #swagger.security = [{"bearerAuth": []}] */
);

export default router;
