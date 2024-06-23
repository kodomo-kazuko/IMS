import express, { Router } from "express";
import EmployeeController from "../controllers/EmployeeController";
import accessMiddleware from "../middleware/accessMiddleware";

const router = Router();
const employeeController = new EmployeeController();

// Auth routes
router.post(
  "/signup",
  accessMiddleware(["employee"]),
  employeeController.signup
);

router.post("/signin", employeeController.signin);

router.get("/all", accessMiddleware(["employee"]), employeeController.index);

export default router;
