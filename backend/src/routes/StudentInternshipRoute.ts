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

router.get("/all/base", accessMiddleware("all"));

router.post(
  "/create",
  accessMiddleware(["student"]),
  studentInternshipController.create /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */
);

router.patch(
  "/start",
  accessMiddleware(["company"], 0),
  studentInternshipController.start /** #swagger.tags = ['StudentInternship'] #swagger.security = [{"bearerAuth": []}] */
);

export default router;
