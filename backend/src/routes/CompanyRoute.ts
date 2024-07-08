import { Router } from "express";
import CompanyController from "../controllers/CompanyController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const companyController = new CompanyController();

router.post("/signin", companyController.signin);

router.get("/all/base", accessMiddleware(["employee"]), companyController.base /** #swagger.tags = ['Company'] */);

router.get("/all/:id", accessMiddleware(["employee"]), companyController.cursor /** #swagger.tags = ['Company'] */);

router.post("/signup", accessMiddleware(["employee"]), companyController.signup /** #swagger.tags = ['Company'] */);

router.patch("/approve", accessMiddleware(["employee"]), companyController.approve /** #swagger.tags = ['Company'] */);

export default router;
