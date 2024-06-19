import { Router } from "express";
import CompanyController from "../controllers/CompanyController";
import tokenMiddleware from "../middleware/tokenMiddleware";

const router = Router();
const companyController = new CompanyController();

router.get("/all", tokenMiddleware, companyController.index);

router.post("/signup", companyController.signup);

router.post("/signin", companyController.signin);

export default router;
