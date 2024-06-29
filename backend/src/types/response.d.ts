import { Request, Response, NextFunction } from "express";

export interface ResponseJSON {
  success: boolean;
  message: string;
  data?: any;
}

export interface Props {
  req: Request;
  res: Response<ResponseJSON>;
  next: NextFunction;
}
