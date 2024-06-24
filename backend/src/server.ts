import express from "express";
import path from "path";

import PostRoute from "./routes/PostRoute";
import UserRoute from "./routes/UserRoute";
import StudentRoute from "./routes/StudentRoute";
import CompanyRoute from "./routes/CompanyRoute";
import EmployeeRoute from "./routes/EmployeeRoute";
import InternshipRoute from "./routes/InternshipRoute";

const IP = process.env.IP || "localhost";
const PORT = parseInt(process.env.PORT || "8080", 10);

const app = express();

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.use("/", UserRoute);
app.use("/post", PostRoute);
app.use("/company", CompanyRoute);
app.use("/student", StudentRoute);
app.use("/employee", EmployeeRoute);
app.use("/internship", InternshipRoute);

app.listen(PORT, IP, () => {
  console.log("server is running on ");
});
