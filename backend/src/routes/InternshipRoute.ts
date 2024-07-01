import accessMiddleware from "../middleware/AccessMiddleware";
import InternshipController from "../controllers/InternshipController";
import { Router } from "express";
const router = Router();

const internshipController = new InternshipController();

router.post("/create", accessMiddleware(["company"]), internshipController.create);

router.get("/all", accessMiddleware("all"), internshipController.all);

router.get("/types", accessMiddleware("all"), internshipController.types);

export default router;
