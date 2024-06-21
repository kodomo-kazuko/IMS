import express, { Request, Response } from "express";

import UserRoute from "./routes/UserRoute";
import StudentRoute from "./routes/StudentRoute";
import CompanyRoute from "./routes/CompanyRoute";
import EmployeeRoute from "./routes/EmployeeRoute";

const app = express();

app.use(express.json());

app.use("/user", UserRoute);
app.use("/company", CompanyRoute);
app.use("/student", StudentRoute);
app.use("/employee", EmployeeRoute);

app.listen(8080, () => {
  console.log("server is running");
});
