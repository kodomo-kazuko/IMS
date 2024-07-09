import { ApplicationStatus, Application } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { limit } from "../utils/const";
import getLastId from "../utils/lastId";
import { prisma } from "../utils/const";
import notFound from "../middleware/not-found";

export default class ApplicationController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { internshipId, type } = req.body;

      const student = await prisma.student.findUniqueOrThrow({
        where: {
          id: Number(req.cookies.id),
        },
      });

      notFound(student.document, "document");

      const application = await prisma.application.findFirst({
        where: {
          internshipId: Number(internshipId),
          studentId: Number(req.cookies.id),
        },
      });

      notFound(application, "application");

      await prisma.application.create({
        data: {
          studentId: req.cookies.id,
          internshipId: Number(internshipId),
          type,
        },
      });

      res.status(201).json({ success: true, message: "application created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async student(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const studentApplications = await prisma.student
        .findUnique({
          where: {
            id: req.cookies.id,
          },
        })
        .applications({
          orderBy: {
            createdAt: "desc",
          },
        });

      notFound(studentApplications, "student Applications");

      return res.status(200).json({
        success: true,
        message: "successfully retirved applications",
        data: studentApplications,
      });
    } catch (error) {
      next(error);
    }
  }
  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const applications = await prisma.application.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
      notFound(applications, "applications");
      const lastId = getLastId(applications);
      return res.status(200).json({
        success: true,
        message: "successfully retirved applications",
        data: {
          lastId,
          list: applications,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const applications = await prisma.application.findMany({
        take: limit,
        skip: 1,
        cursor: {
          id: Number(id),
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      notFound(applications, "applications");
      const lastId = getLastId(applications);
      return res.status(200).json({
        success: true,
        message: "successfully retirved applications",
        data: {
          lastId,
          list: applications,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async internship(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const internshipApplications = await prisma.internship
        .findUnique({
          where: {
            id: Number(id),
            companyId: req.cookies.id,
          },
        })
        .applications({
          orderBy: {
            createdAt: "desc",
          },
          omit: {
            studentId: true,
          },
          include: {
            student: true,
          },
        });
      notFound(internshipApplications, "internship Applications");
      return res
        .status(200)
        .json({ success: true, message: "applications retrieved", data: internshipApplications });
    } catch (error) {
      next(error);
    }
  }
  public async approve(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.body;
      const application = await prisma.application.findUniqueOrThrow({
        where: { id: Number(id) },
      });

      notFound(application, "application");
      const internship = await prisma.internship.findUniqueOrThrow({
        where: { id: application.internshipId },
      });

      notFound(internship, "internship");
      await prisma.application.update({
        where: { id: Number(id) },
        data: { status: "APPROVED" },
      });
      return res.status(200).json({ success: true, message: "Application approved successfully" });
    } catch (error) {
      next(error);
    }
  }
  public async types(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const applicationStatus = Object.values(ApplicationStatus);
      return res.status(200).json({
        success: true,
        message: "retrieved application status types",
        data: applicationStatus,
      });
    } catch (error) {
      next(error);
    }
  }
}
