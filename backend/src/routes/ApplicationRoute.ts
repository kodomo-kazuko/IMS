import express from "express";
import accessMiddleware from "../middleware/accessMiddleware";
import upload from "../middleware/multerMiddleware";
const router = express.Router();

router.post("/create", accessMiddleware(["company"]), upload("documents"));

router.get("/all", accessMiddleware("all"));

router.get("/company/:id", accessMiddleware(["company"]));

router.get("/:id", accessMiddleware(["company"]));

export default router;
