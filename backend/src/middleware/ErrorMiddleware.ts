import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

// interface Error {
//   status?: number;
//   message?: string;
// }

const ErrorMiddleware = (
  error:
    | PrismaClientRustPanicError
    | PrismaClientValidationError
    | PrismaClientKnownRequestError
    | PrismaClientInitializationError,
  _req: Request,
  res: Response<ResponseJSON>,
  _next: NextFunction
) => {
  const status = 500;
  const message = error.message || "Something went wrong";

  console.log(error.message);

  res.status(status).json({
    success: false,
    message: message,
  });
};

export default ErrorMiddleware;
