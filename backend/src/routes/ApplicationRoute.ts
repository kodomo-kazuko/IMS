import accessMiddleware from "../middleware/accessMiddleware";
import upload from "../middleware/multerMiddleware";
import { Router } from "express";
const router = Router();

router.post("/create", accessMiddleware(["company"]), upload("documents"));

router.get("/all", accessMiddleware("all"));

router.get("/company/:id", accessMiddleware(["company"]));

router.get("/:id", accessMiddleware(["company"]));

export default router;
