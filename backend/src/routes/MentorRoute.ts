import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
import MentorController from "../controllers/MentorController";

const router = Router();
const mentorController = new MentorController();

router.post("signin", mentorController.signin);

router.post("/create", accessMiddleware(["company"]), mentorController.create);

router.get("/company", accessMiddleware(["company"]), mentorController.company);

router.get("/all", accessMiddleware(["employee"]), mentorController.all);

router.get("/company/:id", accessMiddleware(["company"]), mentorController.company);

router.get("/:id", accessMiddleware(["employee"]), mentorController.single);

export default router;
