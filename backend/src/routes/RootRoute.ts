import { Router } from "express";
import RootController from "../controllers/RootController";

const router = Router();
const rootController = new RootController();

router.get("/", rootController.check);

router.get("/check", rootController.tokenRenew);

export default router;
