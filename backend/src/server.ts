import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import swaggerUi from "swagger-ui-express";
import ErrorMiddleware from "./middleware/ErrorMiddleware";
import routes from "./routes";
import swaggerDocument from "./swagger/swagger-output.json";
import "./cron/cron";

const IP = process.env.IP || "localhost";
const PORT = Number.parseInt(process.env.PORT || "8080", 10);
const ENV = process.env.NODE_ENV || "development";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/", routes);

if (ENV !== "production") {
	app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(ErrorMiddleware);

app.listen(PORT, IP, () => {
	console.log(`server is running on http://${IP}:${PORT}/`);
});
