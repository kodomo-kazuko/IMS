import express from "express";
const router = express.Router();
import PostController from "../controllers/PostController";
import accessMiddleware from "../middleware/accessMiddleware";
import upload from "../middleware/multerMiddleware";

const postController = new PostController();

router.post("/upload", accessMiddleware(["company"]), upload("images"), postController.create);

router.get("/all", accessMiddleware("all"), postController.all);

router.get("/:id", accessMiddleware("all"), postController.single);

export default router;
