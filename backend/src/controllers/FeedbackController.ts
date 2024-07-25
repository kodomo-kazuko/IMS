import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { prisma } from "../middleware/PrismMiddleware";
import { AccountType } from "@prisma/client";
import notFound from "../utils/not-found";

export default class FeedbackController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { content, score, internshipId } = req.body;
      const internship = await prisma.studentInternship.findFirstOrThrow({
        where: {
          studentId: req.cookies.account === AccountType.student ? req.cookies.id : undefined,
          internshipId: Number(internshipId),
          internship: {
            companyId: req.cookies.account === AccountType.company ? req.cookies.id : undefined,
          },
        },
      });

      notFound(internship, "internship");

      await prisma.feedback.create({
        data: {
          userId: req.cookies.id,
          content: String(content),
          score: Math.max(-1, Math.min(10, Number(score))),
          internshipId: Number(internshipId),
          account: req.cookies.account,
        },
      });
      res.status(200).json({ success: true, message: "feedback submitted" });
    } catch (error) {
      next(error);
    }
  }
  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const feedback = await prisma.feedback.findMany({
        where: {
          studentinternship: {
            internship: {
              companyId: req.query.companyId ? Number(req.query.companyId) : undefined,
            },
          },
        },
      });
      res.status(200).json({ success: true, message: "feedback retrieved", data: feedback });
    } catch (error) {
      next(error);
    }
  }
  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const feedback = await prisma.feedback.findMany({
        skip: 1,
        cursor: {
          id: Number(req.params.id),
        },
        where: {
          studentinternship: {
            internship: {
              companyId: req.query.companyId ? Number(req.query.companyId) : undefined,
            },
          },
        },
      });
      res.status(200).json({ success: true, message: "feedback retrieved", data: feedback });
    } catch (error) {
      next(error);
    }
  }
}
