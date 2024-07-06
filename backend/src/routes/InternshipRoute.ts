import accessMiddleware from "../middleware/AccessMiddleware";
import InternshipController from "../controllers/InternshipController";
import { Router } from "express";
const router = Router();

const internshipController = new InternshipController();

router.get("/types", accessMiddleware("all"), internshipController.types);

router.post("/create", accessMiddleware(["company"]), internshipController.create);

router.get("/all", accessMiddleware(["employee"]), internshipController.all);

router.get("/company", accessMiddleware(["company"]), internshipController.company);

router.get("/:id", accessMiddleware("all"));

export default router;
