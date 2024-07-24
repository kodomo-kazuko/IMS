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
  accessMiddleware("all"),
  applicationController.base /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all/:id",
  accessMiddleware("all"),
  applicationController.cursor /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/count",
  accessMiddleware(["employee"]),
  applicationController.count /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);

router.patch(
  "/approve/:id",
  accessMiddleware(["company"], 0),
  applicationController.approve /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/:id",
  accessMiddleware("all"),
  applicationController.single /** #swagger.tags = ['Application'] #swagger.security = [{"bearerAuth": []}] */
);
export default router;
