import { Router } from "express";
import StudentController from "../controllers/StudentController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();
const studentController = new StudentController();

router.post(
  "/signin",
  studentController.signin /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all/base",
  accessMiddleware(["employee"]),
  studentController.base /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/all/:id",
  accessMiddleware(["employee"]),
  studentController.cursor /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/signup",
  accessMiddleware(["employee"], 1),
  studentController.signup /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/account",
  accessMiddleware(["student"]),
  studentController.account /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/document",
  accessMiddleware(["student"]),
  upload("documents"),
  studentController.createDocument /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */
);

router.post(
  "/image",
  accessMiddleware(["student"]),
  upload("images"),
  studentController.uploadImage /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/:id",
  accessMiddleware(["company", "employee", "mentor"]),
  studentController.single /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */
);

router.delete(
  "/delete/:id",
  accessMiddleware(["employee"], 1),
  studentController.delete /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */
);

router.get(
  "/count",
  accessMiddleware(["employee"]),
  studentController.count /** #swagger.tags = ['Student'] #swagger.security = [{"bearerAuth": []}] */
);
export default router;
