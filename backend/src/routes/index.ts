import { Router } from "express";

import ApplicationRoute from "./ApplicationRoute";
import CompanyRoute from "./CompanyRoute";
import EmployeeRoute from "./EmployeeRoute";
import FeedbackRoute from "./FeedbackRoute";
import InternshipRoute from "./InternshipRoute";
import MajorRoute from "./MajorRoute";
import MentorRoute from "./MentorRoute";
import PostRoute from "./PostRoute";
import RequirementRoute from "./RequirementRoute";
import RoleRoute from "./RoleRoute";
import RootRoute from "./RootRoute";
import StudentInternshipRoute from "./StudentInternshipRoute";
import StudentRoute from "./StudentRoute";
import UploadRoute from "./UploadRoute";

const router = Router();

router.use("/", RootRoute);
router.use("/role", RoleRoute);
router.use("/post", PostRoute);
router.use("/major", MajorRoute);
router.use("/mentor", MentorRoute);
router.use("/uploads", UploadRoute);
router.use("/student", StudentRoute);
router.use("/company", CompanyRoute);
router.use("/feedback", FeedbackRoute);
router.use("/employee", EmployeeRoute);
router.use("/internship", InternshipRoute);
router.use("/requirement", RequirementRoute);
router.use("/application", ApplicationRoute);
router.use("/student-internship", StudentInternshipRoute);

export default router;
