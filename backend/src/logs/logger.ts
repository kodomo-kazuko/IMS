import winston from "winston";
import { format } from "winston";

const logger = winston.createLogger({
	level: "info",
	format: format.combine(format.errors({ stack: true }), format.json()),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: "./src/logs/logs.log" }),
	],
});

export default logger;
