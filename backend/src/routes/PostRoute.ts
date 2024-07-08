import { Router } from "express";
import PostController from "../controllers/PostController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();

const postController = new PostController();

router.post("/create", accessMiddleware(["company"]), upload("images"), postController.create /** #swagger.tags = ['Post'] */);

router.get("/company", accessMiddleware(["company"]), postController.company /** #swagger.tags = ['Post'] */);

router.get("/all/base", accessMiddleware("all"), postController.base /** #swagger.tags = ['Post'] */);

router.get("/all/:id", accessMiddleware("all"), postController.cursor /** #swagger.tags = ['Post'] */);

router.get("/:id", accessMiddleware("all"), postController.single /** #swagger.tags = ['Post'] */);

export default router;
