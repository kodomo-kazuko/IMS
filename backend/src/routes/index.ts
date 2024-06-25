import { Router } from "express";

import RootRoute from "./RootRoute";
import PostRoute from "./PostRoute";
import MajorRoute from "./MajorRoute";
import MentorRoute from "./MentorRoute";
import StudentRoute from "./StudentRoute";
import CompanyRoute from "./CompanyRoute";
import EmployeeRoute from "./EmployeeRoute";
import InternshipRoute from "./InternshipRoute";
import ApplicationRoute from "./ApplicationRoute";

const router = Router();

router.use("/", RootRoute);
router.use("/post", PostRoute);
router.use("/major", MajorRoute);
router.use("/mentor", MentorRoute);
router.use("/student", StudentRoute);
router.use("/company", CompanyRoute);
router.use("/employee", EmployeeRoute);
router.use("/internship", InternshipRoute);
router.use("/application", ApplicationRoute);

export default router;
