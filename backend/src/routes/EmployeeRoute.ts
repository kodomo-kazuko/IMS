import { Router } from "express";
import EmployeeController from "../controllers/EmployeeController";
import tokenMiddleware from "../middleware/tokenMiddleware";

const router = Router();
const employeeController = new EmployeeController();

router.get("/all", tokenMiddleware, employeeController.index);

router.post("/signup", employeeController.signup);

router.post("/signin", employeeController.signin);

export default router;
