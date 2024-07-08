import accessMiddleware from "../middleware/AccessMiddleware";
import InternshipController from "../controllers/InternshipController";
import { Router } from "express";
const router = Router();

const internshipController = new InternshipController();

router.get("/types", accessMiddleware("all"), internshipController.types /** #swagger.tags = ['Internship'] */);

router.post("/create", accessMiddleware(["company"]), internshipController.create /** #swagger.tags = ['Internship'] */);

router.get("/all/base", accessMiddleware("all"), internshipController.base /** #swagger.tags = ['Internship'] */);

router.get("/all/:id", accessMiddleware("all"), internshipController.cursor /** #swagger.tags = ['Internship'] */);

router.get("/company", accessMiddleware(["company"]), internshipController.company /** #swagger.tags = ['Internship'] */);

// router.get("/company/:id", accessMiddleware(["company"]), internshipController.company);

router.get("/:id", accessMiddleware("all") /** #swagger.tags = ['Internship'] */);

export default router;
