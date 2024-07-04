import { Router } from "express";

import RootRoute from "./RootRoute";
import RoleRoute from "./RoleRoute";
import PostRoute from "./PostRoute";
import MajorRoute from "./MajorRoute";
import UploadRoute from "./UploadRoute";
import MentorRoute from "./MentorRoute";
import StudentRoute from "./StudentRoute";
import CompanyRoute from "./CompanyRoute";
import EmployeeRoute from "./EmployeeRoute";
import InternshipRoute from "./InternshipRoute";
import ApplicationRoute from "./ApplicationRoute";
import StudentInternship from "./StudentInternshipRoute";

const router = Router();

router.use("/", RootRoute);
router.use("/role", RoleRoute);
router.use("/post", PostRoute);
router.use("/major", MajorRoute);
router.use("/mentor", MentorRoute);
router.use("/uploads", UploadRoute);
router.use("/student", StudentRoute);
router.use("/company", CompanyRoute);
router.use("/employee", EmployeeRoute);
router.use("/internship", InternshipRoute);
router.use("/application", ApplicationRoute);
router.use("/student-internship", StudentInternship);

export default router;
