import { Request, Response, NextFunction } from "express";
import { ApplicationStatus } from "@prisma/client";

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

export interface ApplicationDTO {
  studentId: string;
  internshipId: string;
  status: ApplicationStatus;
}
