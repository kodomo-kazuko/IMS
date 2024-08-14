import { Router } from "express";

const router = Router();

router.get(
	"/test" /** #swagger.tags = ['Question'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
