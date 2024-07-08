import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
import MentorController from "../controllers/MentorController";

const router = Router();
const mentorController = new MentorController();

router.post("signin", mentorController.signin);

router.post("/create", accessMiddleware(["company"]), mentorController.create /** #swagger.tags = ['Mentor'] */);

router.get("/company", accessMiddleware(["company"]), mentorController.company /** #swagger.tags = ['Mentor'] */);

router.get("/all", accessMiddleware(["employee"]), mentorController.all /** #swagger.tags = ['Mentor'] */);

router.get("/company/:id", accessMiddleware(["company"]), mentorController.company /** #swagger.tags = ['Mentor'] */);

router.get("/:id", accessMiddleware(["employee"]), mentorController.single /** #swagger.tags = ['Mentor'] */);

export default router;
