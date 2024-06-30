import { Router } from "express";
import CompanyController from "../controllers/CompanyController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const companyController = new CompanyController();

router.post("/signin", companyController.signin);

router.get("/all", accessMiddleware(["employee"]), companyController.all);

router.post("/signup", accessMiddleware(["employee"]), companyController.signup);

router.patch("/approve", accessMiddleware(["employee"]), companyController.approve);

export default router;
