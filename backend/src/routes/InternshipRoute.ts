import accessMiddleware from "../middleware/AccessMiddleware";
import InternshipController from "../controllers/InternshipController";
import { Router } from "express";
const router = Router();

const internshipController = new InternshipController();

router.get(
  "/types",
  accessMiddleware("all"),
  internshipController.types /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/create",
  accessMiddleware(["company"], 0),
  internshipController.create /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all/base",
  accessMiddleware("all"),
  internshipController.base /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all/:id",
  accessMiddleware("all"),
  internshipController.cursor /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/company",
  accessMiddleware(["company"], 0),
  internshipController.company /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/company/:id",
  accessMiddleware(["employee"], 0),
  internshipController.company /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/:id",
  accessMiddleware("all"),
  internshipController.single /** #swagger.tags = ['Internship'] #swagger.security = [{"bearerAuth": []}] */
);

export default router;
