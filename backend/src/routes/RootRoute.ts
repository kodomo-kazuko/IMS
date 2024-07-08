import { Router } from "express";
import RootController from "../controllers/RootController";

const router = Router();
const rootController = new RootController();

router.get("/", rootController.check /** #swagger.tags = ['Root'] */);

router.get("/check", rootController.tokenRenew /** #swagger.tags = ['Root'] */);

router.post("/test", (req, res, next) => rootController.test({ req, res, next }) /** #swagger.tags = ['Root'] */);

export default router;
