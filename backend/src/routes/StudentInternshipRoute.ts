import StudentInternshipController from "../controllers/StudentInternshipController";
import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();

const studentInternshipController = new StudentInternshipController();

router.get(
  "/types",
  accessMiddleware("all"),
  studentInternshipController.types /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/create",
  accessMiddleware(["student"]),
  studentInternshipController.create /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */
);

router.patch(
  "/start",
  accessMiddleware(["company"]),
  studentInternshipController.start /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/company",
  accessMiddleware(["company"]),
  studentInternshipController.company /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/internship/:id",
  accessMiddleware(["company"]),
  studentInternshipController.internships /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/student",
  accessMiddleware(["student"]),
  studentInternshipController.student /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */
);

export default router;
