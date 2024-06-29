import { Request, Response, NextFunction } from "express";

export interface ResponseJSON {
  success: boolean;
  message: string;
  data?: any;
}
