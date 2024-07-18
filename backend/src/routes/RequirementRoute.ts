import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
import Requirement from "../controllers/RequirementController";

const requirement = new Requirement();

const router = Router();

router.post(
  "/create",
  accessMiddleware(["company"]),
  requirement.create /** #swagger.tags = ['Requirement'] #swagger.security = [{"bearerAuth": []}] */
);

export default router;
