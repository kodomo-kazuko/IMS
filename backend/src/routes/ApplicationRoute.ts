import ApplicationController from "../controllers/ApplicationController";
import accessMiddleware from "../middleware/AccessMiddleware";
import { Router } from "express";
const router = Router();

const applicationController = new ApplicationController();

router.post("/create", accessMiddleware(["student"]), applicationController.create);

router.get("/all", accessMiddleware("all"), applicationController.all);

router.get("/company", accessMiddleware(["company"]));

router.get("/student", accessMiddleware(["student"]), applicationController.student);

router.patch("/approve", accessMiddleware(["company"]), applicationController.approve);

router.get("/internship/:id", accessMiddleware(["company"]), applicationController.internship);

export default router;
