import { prisma } from "../middleware/PrismMiddleware";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";

export default class Requirement {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { majorId, internshipId, studentLimit } = req.body;
      await prisma.Requirement.create({
        data: {
          internshipId: Number(internshipId),
          majorId: Number(majorId),
          studentLimit: Number(studentLimit),
        },
      });
      return res.status(200).json({ success: true, message: "internship Requirement created" });
    } catch (error) {
      next(error);
    }
  }
}
