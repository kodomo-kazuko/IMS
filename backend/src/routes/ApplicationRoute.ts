import ApplicationController from "../controllers/ApplicationController";
import accessMiddleware from "../middleware/AccessMiddleware";
import { Router } from "express";
const router = Router();

const applicationController = new ApplicationController();

router.get(
  "/types",
  accessMiddleware("all"),
  applicationController.types /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/create",
  accessMiddleware(["student"]),
  applicationController.create /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all/base",
  accessMiddleware(["employee"]),
  applicationController.base /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all/:id",
  accessMiddleware(["employee"]),
  applicationController.cursor /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/student",
  accessMiddleware(["student"]),
  applicationController.student /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);

router.patch(
  "/approve",
  accessMiddleware(["company"]),
  applicationController.approve /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/internship/:id",
  accessMiddleware(["company"]),
  applicationController.internship /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);

export default router;
