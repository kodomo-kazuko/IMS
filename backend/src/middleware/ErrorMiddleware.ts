import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";

interface Error {
  status?: number;
  message?: string;
}

const ErrorMiddleware = (
  err: Error,
  _req: Request,
  res: Response<ResponseJSON>,
  _next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  console.log(err);

  res.status(status).json({
    success: false,
    message: message,
  });
};

export default ErrorMiddleware;
