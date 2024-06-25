import path from "path";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

import routes from "./routes";

const IP = process.env.IP || "localhost";
const PORT = parseInt(process.env.PORT || "8080", 10);

const app = express();

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.use("/", routes);

app.listen(PORT, IP, () => {
  console.log(`server is running on http://${IP}:${PORT}/`);
});
