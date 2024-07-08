import ApplicationController from "../controllers/ApplicationController";
import accessMiddleware from "../middleware/AccessMiddleware";
import { Router } from "express";
const router = Router();

const applicationController = new ApplicationController();

router.get("/types", accessMiddleware("all"), applicationController.types /** #swagger.tags = ['Application'] */);

router.post("/create", accessMiddleware(["student"]), applicationController.create /** #swagger.tags = ['Application'] */);

router.get("/all/base", accessMiddleware(["employee"]), applicationController.base) /** #swagger.tags = ['Application'] */;

router.get("/all/:id", accessMiddleware(["employee"]), applicationController.cursor /** #swagger.tags = ['Application'] */);

router.get("/student", accessMiddleware(["student"]), applicationController.student /** #swagger.tags = ['Application'] */);

router.patch("/approve", accessMiddleware(["company"]), applicationController.approve /** #swagger.tags = ['Application'] */);

router.get("/internship/:id", accessMiddleware(["company"]), applicationController.internship /** #swagger.tags = ['Application'] */);

export default router;
