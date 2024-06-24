import { Router } from "express";
import MajorController from "../controllers/MajorController";

const router = Router();
const majorController = new MajorController();

router.get("/all", majorController.all);

export default router;
