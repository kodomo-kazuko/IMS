import { Router } from "express";

import ApplicationRoute from "./ApplicationRoute";
import CompanyRoute from "./CompanyRoute";
import EmployeeRoute from "./EmployeeRoute";
import FeedbackRoute from "./FeedbackRoute";
import InternshipRoute from "./InternshipRoute";
import MajorRoute from "./MajorRoute";
import MentorRoute from "./MentorRoute";
import PostRoute from "./PostRoute";
import QuestionRoute from "./QuestionRoute";
import RequirementRoute from "./RequirementRoute";
import RoleRoute from "./RoleRoute";
import RootRoute from "./RootRoute";
import StudentInternshipRoute from "./StudentInternshipRoute";
import StudentRoute from "./StudentRoute";
import SurveyRoute from "./SurveyRoute";
import UploadRoute from "./UploadRoute";

const router = Router();

router.use("/application", ApplicationRoute);
router.use("/company", CompanyRoute);
router.use("/employee", EmployeeRoute);
router.use("/feedback", FeedbackRoute);
router.use("/internship", InternshipRoute);
router.use("/major", MajorRoute);
router.use("/mentor", MentorRoute);
router.use("/post", PostRoute);
router.use("/question", QuestionRoute);
router.use("/requirement", RequirementRoute);
router.use("/role", RoleRoute);
router.use("/", RootRoute);
router.use("/student-internship", StudentInternshipRoute);
router.use("/student", StudentRoute);
router.use("/survey", SurveyRoute);
router.use("/uploads", UploadRoute);

export default router;
