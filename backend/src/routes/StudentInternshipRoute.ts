import StudentInternshipController from "../controllers/StudentInternshipController";
import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();

const studentInternshipController = new StudentInternshipController();

router.post("/create", accessMiddleware(["student"]), studentInternshipController.create);

router.patch("/start", accessMiddleware(["company"]), studentInternshipController.start);

export default router;
