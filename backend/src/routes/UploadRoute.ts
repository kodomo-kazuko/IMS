// import { Router } from "express";
// import accessMiddleware from "../middleware/AccessMiddleware";
// import UploadController from "../controllers/UploadController";

// const uploadController = new UploadController();

// const router = Router();

// router.use(
//   "/",
//   // accessMiddleware("all"),
//   uploadController.single /** #swagger.tags = ['Upload'] #swagger.security = [{"bearerAuth": []}] */
// );

// export default router;

import express, { Router } from "express";
import path from "path";
import accessMiddleware from "../middleware/AccessMiddleware";
const router = Router();

const FILE_PATH = process.env.FILE_PATH;

router.use(
  "/",
  accessMiddleware("all"),
  express.static(
    path.join(__dirname + `../../${FILE_PATH}`)
    /** #swagger.tags = ['Upload'] #swagger.security = [{"bearerAuth": []}] */
  )
);

export default router;
