import express, { Request, Response } from "express";
import UserRoute from "./routes/UserRoute";

const app = express();

app.use(express.json());

app.use("/user", UserRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "its working" });
});

app.listen(8080, () => {
  console.log("server is running");
});
