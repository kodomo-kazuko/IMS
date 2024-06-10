import { Router } from "express";
import CompanyController from "../controllers/CompanyController";

const router = Router();
const companyController = new CompanyController();

router.get("/all", (req, res) => companyController.index(req, res));

router.post("/signup", (req, res) => companyController.signup(req, res));

router.post("/signin", (req, res) => companyController.signin(req, res));

export default router;
