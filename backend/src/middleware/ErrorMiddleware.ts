import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";

interface Error {
  status?: number;
  message?: string;
}

const ErrorMiddleware = (err: Error, req: Request, res: Response<ResponseJSON>, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    success: false,
    message: message,
  });
};

export default ErrorMiddleware;
