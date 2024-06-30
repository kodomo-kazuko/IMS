import { Router } from "express";
import EmployeeController from "../controllers/EmployeeController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const employeeController = new EmployeeController();

router.post("/signin", employeeController.signin);

router.post("/signup", accessMiddleware(["employee"]), employeeController.signup);

router.get("/all", accessMiddleware(["employee"]), employeeController.all);

export default router;
