import { Router } from "express";
import StudentController from "../controllers/StudentController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();
const studentController = new StudentController();

router.post("/signin", studentController.signin);

router.get("/all", accessMiddleware(["employee"]), studentController.all);

router.post("/signup", accessMiddleware(["employee"]), studentController.signup);

router.get("/account", accessMiddleware(["student"]), studentController.account);

router.post("/cv", accessMiddleware(["student"]), upload("documents"), studentController.createCV);

router.post("/image", accessMiddleware(["student"]), upload("images"), studentController.uploadImage);

router.get("/:id", accessMiddleware(["company", "employee", "mentor"]), studentController.single);

export default router;
