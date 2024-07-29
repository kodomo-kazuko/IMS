import { ApplicationStatus } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ApplicationDTO, ResponseJSON } from "../types/response";
import { prisma } from "../middleware/PrismMiddleware";
import notFound from "../utils/not-found";

export default class ApplicationController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const internshipId = Number(req.params.id);
      const studentId = Number(req.cookies.id);

      const student = await prisma.student.findUniqueOrThrow({
        where: {
          id: studentId,
        },
      });

      notFound(student.document, "document");

      const requirements = await prisma.internship
        .findUniqueOrThrow({
          where: {
            id: internshipId,
          },
        })
        .requirements();

      notFound(requirements, "internship requirements");

      let isEligible = false;
      let requirementId: number;

      for (const requirement of requirements) {
        if (requirement.majorId === req.cookies.access) {
          const startedCount = await prisma.application.count({
            where: {
              requirementId: requirement.id,
              status: "started",
            },
          });

          if (startedCount < requirement.studentLimit) {
            isEligible = true;
            requirementId = requirement.id;
            break;
          }
        }
      }

      if (!isEligible) {
        return res
          .status(403)
          .json({ success: false, message: "You are not eligible to apply for this internship." });
      }

      await prisma.application.create({
        data: {
          studentId: studentId,
          internshipId: internshipId,
          requirementId: requirementId!,
        },
      });

      res.status(201).json({ success: true, message: "Application created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { studentId, internshipId, status } = req.query as unknown as ApplicationDTO;
      const applications = await prisma.application.findMany({
        where: {
          studentId: studentId ? Number(studentId) : undefined,
          internshipId: internshipId ? Number(internshipId) : undefined,
          status: status ? status : undefined,
        },
        omit: {
          studentId: internshipId ? true : false,
          internshipId: studentId ? true : false,
        },
        include: {
          student: internshipId ? true : false,
          internship: studentId
            ? {
                include: {
                  company: {
                    select: {
                      name: true,
                      id: true,
                      image: true,
                    },
                  },
                },
              }
            : false,
        },
      });

      res.status(200).json({
        success: true,
        message: "successfully retirved applications",
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }
  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { studentId, internshipId, status } = req.query as unknown as ApplicationDTO;
      const applications = await prisma.application.findMany({
        skip: 1,
        cursor: {
          id: Number(req.params.id),
        },
        where: {
          studentId: studentId ? Number(studentId) : undefined,
          internshipId: internshipId ? Number(internshipId) : undefined,
          status: status ? status : undefined,
        },
        omit: {
          studentId: internshipId ? true : false,
          internshipId: studentId ? true : false,
        },
        include: {
          student: internshipId ? true : false,
          internship: studentId
            ? {
                include: {
                  company: {
                    select: {
                      name: true,
                      id: true,
                      image: true,
                    },
                  },
                },
              }
            : false,
        },
      });

      res.status(200).json({
        success: true,
        message: "successfully retirved applications",
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }
  public async approve(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const applicationId = Number(req.params.id);
      const companyId = Number(req.cookies.id);

      if (isNaN(applicationId) || isNaN(companyId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid application or company ID" });
      }

      const application = await prisma.application.findUniqueOrThrow({
        where: {
          id: applicationId,
          internship: {
            companyId: companyId,
          },
        },
        include: {
          student: {
            select: {
              majorId: true,
            },
          },
          requirement: true,
        },
      });

      let isEligible = false;

      const startedCount = await prisma.application.count({
        where: {
          requirementId: application.requirementId,
          status: "started",
        },
      });

      if (startedCount < application.requirement.studentLimit) {
        isEligible = true;
      }

      if (!isEligible) {
        return res
          .status(400)
          .json({ success: false, message: "Application does not meet the eligibility criteria" });
      }

      await prisma.application.update({
        where: { id: applicationId },
        data: { status: "approved" },
      });

      res.status(200).json({ success: true, message: "Application approved successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async types(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const applicationStatus = Object.values(ApplicationStatus);
      res.status(200).json({
        success: true,
        message: "retrieved application status types",
        data: applicationStatus,
      });
    } catch (error) {
      next(error);
    }
  }
  public async single(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const application = await prisma.application.findUniqueOrThrow({
        where: {
          id: Number(req.params.id),
        },
        omit: {
          studentId: true,
        },
        include: {
          student: true,
          internship: {
            include: {
              company: true,
            },
          },
        },
      });
      res
        .status(200)
        .json({ success: true, message: "application returned successfully", data: application });
    } catch (error) {
      next(error);
    }
  }
  public async count(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const applicationCount = await prisma.application.count();
      return res
        .status(200)
        .json({ success: true, message: "application count retrieved", data: applicationCount });
    } catch (error) {
      next(error);
    }
  }
}
