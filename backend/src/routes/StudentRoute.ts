import { Router } from "express";
import StudentController from "../controllers/StudentController";

const router = Router();
const studentController = new StudentController();

router.get("/all", (req, res) => studentController.index(req, res));

router.post("/signup", (req, res) => studentController.signup(req, res));

router.post("/signin", (req, res) => studentController.signin(req, res));

export default router;
