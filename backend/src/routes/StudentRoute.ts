import { Router } from "express";
import StudentController from "../controllers/StudentController";
import tokenMiddleware from "../middleware/tokenMiddleware";

const router = Router();
const studentController = new StudentController();

router.get("/all", tokenMiddleware, studentController.index);

router.post("/signup", studentController.signup);

router.post("/signin", studentController.signin);

export default router;
