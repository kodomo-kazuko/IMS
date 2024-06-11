import { Router } from "express";
import EmployeeController from "../controllers/EmployeeController";

const router = Router();
const employeeController = new EmployeeController();

router.get("/all", (req, res) => employeeController.index(req, res));

router.post("/signup", (req, res) => employeeController.signup(req, res));

router.post("/signin", (req, res) => employeeController.signin(req, res));

export default router;
