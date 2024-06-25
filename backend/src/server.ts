import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

import routes from "./routes";

const IP = process.env.IP || "localhost";
const PORT = parseInt(process.env.PORT || "8080", 10);
const FRONT_PORT = process.env.FRONT_PORT || "3000";

const app = express();

app.use("/", routes);
app.use(express.json());
app.use(cors({ origin: `${IP}:${FRONT_PORT}` }));
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(PORT, IP, () => {
  console.log(`server is running on http://${IP}:${PORT}/`);
});
