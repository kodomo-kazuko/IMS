import { Router } from "express";
import PostController from "../controllers/PostController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();

const postController = new PostController();

router.post("/create", accessMiddleware(["company"]), upload("images"), postController.create);

router.get("/company", accessMiddleware(["company"]), postController.company);

router.get("/all/base", accessMiddleware("all"), postController.base);

router.get("/all/:id", accessMiddleware("all"), postController.cursor);

router.get("/:id", accessMiddleware("all"), postController.single);

export default router;
