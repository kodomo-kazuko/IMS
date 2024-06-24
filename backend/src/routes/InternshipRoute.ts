import express from "express";
import accessMiddleware from "../middleware/accessMiddleware";
import InternshipController from "../controllers/InternshipController";

const router = express.Router();
const internshipController = new InternshipController();

router.post("/create", accessMiddleware(["company"]), internshipController.create);

router.get("/all", accessMiddleware("none"), internshipController.all);

export default router;
