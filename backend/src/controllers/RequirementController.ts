import { prisma } from "../middleware/PrismMiddleware";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";

export default class RequirementController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { majorId, internshipId, studentLimit } = req.body;
      await prisma.internship.findUniqueOrThrow({
        where: {
          id: Number(internshipId),
          companyId: req.cookies.id,
        },
      });
      await prisma.requirement.create({
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
  public async internship(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const internshipId = Number(req.params.id);
      const requirements = await prisma.internship
        .findUniqueOrThrow({
          where: {
            id: internshipId,
          },
        })
        .Requirement();
      res
        .status(200)
        .json({ success: true, message: "requirements retrieved", data: requirements });
    } catch (error) {
      next(error);
    }
  }
  public async delete(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.requirement.delete({
        where: {
          id: Number(id),
          internship: {
            companyId: req.cookies.id,
          },
        },
      });
      res.status(200).json({ success: true, message: "requirement deleted" });
    } catch (error) {
      next(error);
    }
  }
}
