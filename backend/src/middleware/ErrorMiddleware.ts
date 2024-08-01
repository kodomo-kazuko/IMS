import type {
	PrismaClientInitializationError,
	PrismaClientKnownRequestError,
	PrismaClientRustPanicError,
	PrismaClientUnknownRequestError,
	PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import type { NextFunction, Request, Response } from "express";
import logger from "../logs/logger";
import type { ResponseJSON } from "../types/response";

const ErrorMiddleware = (
	error:
		| PrismaClientRustPanicError
		| PrismaClientValidationError
		| PrismaClientKnownRequestError
		| PrismaClientInitializationError
		| PrismaClientUnknownRequestError
		| Error,
	_req: Request,
	res: Response<ResponseJSON>,
	_next: NextFunction,
) => {
	const status = 500;
	const message = error.message || "Something went wrong";

	logger.error(error);

	res.status(status).json({
		success: false,
		message: message,
	});
};

export default ErrorMiddleware;
