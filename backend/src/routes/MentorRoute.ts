import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
import MentorController from "../controllers/MentorController";

const router = Router();
const mentorController = new MentorController();

router.post(
  "/signin",
  mentorController.signin /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/create",
  accessMiddleware(["company"], 0),
  mentorController.create /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all/base",
  accessMiddleware(["employee"]),
  mentorController.base /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all/:id",
  accessMiddleware(["employee"]),
  mentorController.cursor /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */
);

router.delete(
  "/delete/:id",
  accessMiddleware(["company"], 0),
  mentorController.delete /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/:id",
  accessMiddleware(["employee"]),
  mentorController.single /** #swagger.tags = ['Mentor'] #swagger.security = [{"bearerAuth": []}] */
);

export default router;
