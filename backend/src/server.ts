import path from "path";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

import PostRoute from "./routes/PostRoute";
import UserRoute from "./routes/UserRoute";
import MajorRoute from "./routes/MajorRoute";
import StudentRoute from "./routes/StudentRoute";
import CompanyRoute from "./routes/CompanyRoute";
import EmployeeRoute from "./routes/EmployeeRoute";
import InternshipRoute from "./routes/InternshipRoute";
import ApplicationRoute from "./routes/ApplicationRoute";

const IP = process.env.IP || "localhost";
const PORT = parseInt(process.env.PORT || "8080", 10);

const app = express();

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.use("/", UserRoute);
app.use("/post", PostRoute);
app.use("/major", MajorRoute);
app.use("/company", CompanyRoute);
app.use("/student", StudentRoute);
app.use("/employee", EmployeeRoute);
app.use("/internship", InternshipRoute);
app.use("/application", ApplicationRoute);

app.listen(PORT, IP, () => {
  console.log(`server is running on http://${IP}:${PORT}/`);
});
