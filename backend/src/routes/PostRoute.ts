import { Router } from "express";
import PostController from "../controllers/PostController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();

const postController = new PostController();

router.post(
	"/create",
	accessMiddleware([{ account: "Company", access: 0 }]),
	upload("images"),
	postController.create /** #swagger.tags = ['Post'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/base",
	accessMiddleware("all"),
	postController.base /** #swagger.tags = ['Post'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/all/:id",
	accessMiddleware("all"),
	postController.cursor /** #swagger.tags = ['Post'] #swagger.security = [{"bearerAuth": []}] */,
);

router.patch(
	"/edit/:id/data",
	accessMiddleware([{ account: "Company", access: 0 }]),
	postController.editData /** #swagger.tags = ['Post'] #swagger.security = [{"bearerAuth": []}] */,
);

router.patch(
	"/edit/:id/image",
	accessMiddleware([{ account: "Company", access: 0 }]),
	postController.editImage /** #swagger.tags = ['Post'] #swagger.security = [{"bearerAuth": []}] */,
);

router.delete(
	"/delete/:id",
	accessMiddleware([{ account: "Company", access: 0 }]),
	postController.delete /** #swagger.tags = ['Post'] #swagger.security = [{"bearerAuth": []}] */,
);

router.get(
	"/:id",
	accessMiddleware("all"),
	postController.single /** #swagger.tags = ['Post'] #swagger.security = [{"bearerAuth": []}] */,
);

export default router;
