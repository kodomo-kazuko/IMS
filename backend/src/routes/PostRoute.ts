import { Router } from "express";
import PostController from "../controllers/PostController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();

const postController = new PostController();

router.post("/create", accessMiddleware(["company"]), upload("images"), postController.create);

router.get("/all", accessMiddleware("all"), postController.all);

router.get("/company", accessMiddleware(["company"]), postController.company);

router.get("/:id", accessMiddleware("all"), postController.single);

export default router;
