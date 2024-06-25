import accessMiddleware from "../middleware/accessMiddleware";
import InternshipController from "../controllers/InternshipController";
import { Router } from "express";
const router = Router();

const internshipController = new InternshipController();

router.post("/create", accessMiddleware(["company"]), internshipController.create);

router.get("/all", accessMiddleware("all"), internshipController.all);

export default router;
