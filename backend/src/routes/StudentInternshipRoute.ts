import StudentInternshipController from "../controllers/StudentInternshipController";
import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();

const studentInternshipController = new StudentInternshipController();

router.get("/types", accessMiddleware("all"), studentInternshipController.types /** #swagger.tags = ['StudentInternship'] */);

router.post("/create", accessMiddleware(["student"]), studentInternshipController.create /** #swagger.tags = ['StudentInternship'] */);

router.patch("/start", accessMiddleware(["company"]), studentInternshipController.start /** #swagger.tags = ['StudentInternship'] */);

router.get("/company", accessMiddleware(["company"]), studentInternshipController.company /** #swagger.tags = ['StudentInternship'] */);

router.get("/internship/:id", accessMiddleware(["company"]), studentInternshipController.internships /** #swagger.tags = ['StudentInternship'] */);

router.get("/student", accessMiddleware(["student"]), studentInternshipController.student /** #swagger.tags = ['StudentInternship'] */);

export default router;
