import { Router } from "express";
import accessMiddleware from "../middleware/AccessMiddleware";
import UploadController from "../controllers/UploadController";

const uploadController = new UploadController();

const router = Router();

router.use("/", uploadController.single);

export default router;

// import express, { Router } from "express";
// import accessMiddleware from "../middleware/AccessMiddleware";
// import path from "path";
// const router = Router();

// const FILE_PATH = process.env.FILE_PATH;

// router.use("/", express.static(path.join(__dirname + `../../${FILE_PATH}`)));

// export default router;
