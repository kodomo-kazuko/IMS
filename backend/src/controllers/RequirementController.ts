import { prisma } from "../middleware/PrismMiddleware";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import notFound from "../utils/not-found";
import { validateInput } from "../utils/validateInput";

export default class RequirementController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { majorId, internshipId, studentLimit } = req.body;

      validateInput({ majorId, internshipId, studentLimit }, res);

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
        .requirements({
          include: {
            _count: {
              select: {
                Application: {
                  where: {
                    status: "started",
                  },
                },
              },
            },
          },
        });
      notFound(requirements, "requirements");
      res
        .status(200)
        .json({ success: true, message: "requirements retrieved", data: requirements });
    } catch (error) {
      next(error);
    }
  }
  public async delete(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      await prisma.requirement.delete({
        where: {
          id: Number(req.params.id),
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
  public async edit(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { studentLimit, majorId } = req.query;

      validateInput({ studentLimit, majorId }, res);

      const updatedRequirement = await prisma.requirement.updateMany({
        where: {
          id: Number(req.params.id),
          internship: {
            companyId: req.cookies.id,
          },
        },
        data: {
          studentLimit: studentLimit ? Number(studentLimit) : undefined,
          majorId: majorId ? Number(majorId) : undefined,
        },
      });

      if (updatedRequirement.count === 0) {
        return res.status(404).json({ success: false, message: "Requirement not found" });
      }

      res.status(200).json({ success: true, message: "Requirement updated" });
    } catch (error) {
      next(error);
    }
  }
}
