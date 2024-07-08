import cors from "cors";
import dotenv from "dotenv";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger_output.json";

dotenv.config();

import express from "express";
import routes from "./routes";
import ErrorMiddleware from "./middleware/ErrorMiddleware";

const IP = process.env.IP || "localhost";
const PORT = parseInt(process.env.PORT || "8080", 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/", routes);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(ErrorMiddleware);

app.listen(PORT, IP, () => {
  console.log(`server is running on http://${IP}:${PORT}/`);
});
