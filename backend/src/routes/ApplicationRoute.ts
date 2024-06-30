import ApplicationController from "../controllers/ApplicationController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";
import { Router } from "express";
const router = Router();

const applicationController = new ApplicationController();

router.post("/create", accessMiddleware(["student"]), upload("documents"), applicationController.create);

router.get("/all", accessMiddleware("all"), applicationController.all);

router.get("/company", accessMiddleware(["company"]));

router.get("/student", accessMiddleware(["student"]), applicationController.student);

router.get("/internship/:id", accessMiddleware(["company"]), applicationController.internship);

router.patch("/approve", accessMiddleware(["company"]), applicationController.approve);

export default router;
