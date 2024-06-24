import express from "express";
const router = express.Router();
import PostController from "../controllers/PostController";
import accessMiddleware from "../middleware/accessMiddleware";
import upload from "../middleware/multerMiddleware";

const postController = new PostController();

router.post("/upload", accessMiddleware(["company"]), upload("image"), postController.create);

router.get("/:id", accessMiddleware("none"), postController.single);

router.get("/all", accessMiddleware("none"));

export default router;
