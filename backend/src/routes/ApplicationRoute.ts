import ApplicationController from "../controllers/ApplicationController";
import accessMiddleware from "../middleware/AccessMiddleware";
import { Router } from "express";
const router = Router();

const applicationController = new ApplicationController();

router.get("/types", accessMiddleware("all"), applicationController.types);

router.post("/create", accessMiddleware(["student"]), applicationController.create);

router.get("/all/base", accessMiddleware(["employee"]), applicationController.base);

router.get("/all/:id", accessMiddleware(["employee"]), applicationController.cursor);

router.get("/company", accessMiddleware(["company"]));

router.get("/student", accessMiddleware(["student"]), applicationController.student);

router.patch("/approve", accessMiddleware(["company"]), applicationController.approve);

router.get("/internship/:id", accessMiddleware(["company"]), applicationController.internship);

export default router;
