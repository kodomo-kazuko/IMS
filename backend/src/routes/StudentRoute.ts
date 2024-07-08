import { Router } from "express";
import StudentController from "../controllers/StudentController";
import accessMiddleware from "../middleware/AccessMiddleware";
import upload from "../middleware/MulterMiddleware";

const router = Router();
const studentController = new StudentController();

router.post("/signin", studentController.signin /** #swagger.tags = ['Student'] */);

router.get("/all/base", accessMiddleware(["employee"]), studentController.base /** #swagger.tags = ['Student'] */);

router.get("/all/:id", accessMiddleware(["employee"]), studentController.cursor /** #swagger.tags = ['Student'] */);

router.post("/signup", accessMiddleware(["employee"]), studentController.signup /** #swagger.tags = ['Student'] */);

router.get("/account", accessMiddleware(["student"]), studentController.account /** #swagger.tags = ['Student'] */);

router.post("/cv", accessMiddleware(["student"]), upload("documents"), studentController.createCV /** #swagger.tags = ['Student'] */);

router.post("/image", accessMiddleware(["student"]), upload("images"), studentController.uploadImage /** #swagger.tags = ['Student'] */);

router.get("/:id", accessMiddleware(["company", "employee", "mentor"]), studentController.single /** #swagger.tags = ['Student'] */);

export default router;
