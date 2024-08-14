import { Router } from "express";
import RootController from "../controllers/RootController";
import accessMiddleware from "../middleware/AccessMiddleware";

const router = Router();
const rootController = new RootController();

router.get(
	"/",
	rootController.check /** #swagger.tags = ['Root'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/check",
	rootController.tokenRenew /** #swagger.tags = ['Root'] #swagger.security = [{"bearerAuth": []}] */,
);

router.post(
	"/test",
	accessMiddleware("all"),
	(req, res, next) => rootController.test({ req, res, next }),
	/** #swagger.tags = ['Root']  #swagger.security = [{"bearerAuth": []}] */
);

router.get(
	"/account",
	accessMiddleware("all"),
	rootController.account /** #swagger.tags = ['Root']  #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
