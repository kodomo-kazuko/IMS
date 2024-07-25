import { ApplicationStatus } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ApplicationDTO, ResponseJSON } from "../types/response";
import { prisma } from "../middleware/PrismMiddleware";
import notFound from "../utils/not-found";

export default class FeedbackController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      // const feedback = await prisma.feedback.create({
      //   data: {
      //   }
      // })
    } catch (error) {
      next(error);
    }
  }
}
