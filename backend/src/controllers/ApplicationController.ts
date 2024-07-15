import { ApplicationStatus, Application } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { limit } from "../utils/const";
import getLastId from "../utils/lastId";
import { prisma } from "../utils/const";
import notFound from "../utils/not-found";

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
  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { studentId, internshipId } = req.query;
      const applications = await prisma.application.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          studentId: studentId === req.cookies.id ? Number(studentId) : undefined,
          internshipId: internshipId ? Number(internshipId) : undefined,
        },
      });
      notFound(applications, "applications");
      const lastId = getLastId(applications);
      res.status(200).json({
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
      const studentId = Number(req.query.student);
      const internshipId = Number(req.query.internshipId);
      const { id } = req.params;
      const applications = await prisma.application.findMany({
        take: limit,
        skip: 1,
        cursor: {
          id: Number(id),
        },
        where: {
          studentId: studentId === req.cookies.id ? studentId : undefined,
          internshipId: internshipId ? internshipId : undefined,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      notFound(applications, "applications");
      const lastId = getLastId(applications);
      res.status(200).json({
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
}
