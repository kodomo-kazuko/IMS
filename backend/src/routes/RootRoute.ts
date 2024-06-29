import { Router } from "express";
import RootController from "../controllers/RootController";

const router = Router();
const rootController = new RootController();

router.get("/", rootController.check);

router.get("/check", rootController.tokenRenew);

router.post("/test", (req, res, next) => rootController.test({ req, res, next }));

export default router;
