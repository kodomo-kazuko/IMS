import StudentInternshipController from "../controllers/StudentInternshipController";
import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();

const studentInternshipController = new StudentInternshipController();

router.get("/types", accessMiddleware("all"), studentInternshipController.types);

router.post("/create", accessMiddleware(["student"]), studentInternshipController.create);

router.patch("/start", accessMiddleware(["company"]), studentInternshipController.start);

router.get("/company", accessMiddleware(["company"]), studentInternshipController.company);

export default router;
