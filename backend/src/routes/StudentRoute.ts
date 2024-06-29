import { Router } from "express";
import StudentController from "../controllers/StudentController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const studentController = new StudentController();

router.get("/all", accessMiddleware(["employee"]), studentController.index);

router.post("/signup", accessMiddleware(["employee"]), studentController.signup);

router.post("/signin", studentController.signin);

export default router;
