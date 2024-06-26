import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import express from "express";
import routes from "./routes";
import ErrorMiddleware from "./middleware/ErrorMiddleware";
import accessMiddleware from "./middleware/accessMiddleware";

const IP = process.env.IP || "localhost";
const PORT = parseInt(process.env.PORT || "8080", 10);
const FRONT_PORT = process.env.FRONT_PORT || "3000";

const app = express();

app.use(cors({ origin: `${IP}:${FRONT_PORT}` }));
app.use(express.json());
app.use("/", routes);
app.use("/uploads", accessMiddleware("all"), express.static(path.join(__dirname + "/uploads")));

app.use(ErrorMiddleware);

app.listen(PORT, IP, () => {
  console.log(`server is running on http://${IP}:${PORT}/`);
});
