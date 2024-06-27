import ApplicationController from "../controllers/ApplicationController";
import accessMiddleware from "../middleware/accessMiddleware";
import upload from "../middleware/multerMiddleware";
import { Router } from "express";
const router = Router();

const applicationController = new ApplicationController();

router.post("/create", accessMiddleware(["student"]), upload("documents"), applicationController.create);

router.get("/all", accessMiddleware("all"), applicationController.all);

router.get("/company", accessMiddleware(["company"]));

router.get("/student", accessMiddleware(["student"]), applicationController.student);

export default router;
