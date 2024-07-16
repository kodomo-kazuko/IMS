import { ApplicationStatus } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ApplicationDTO, ResponseJSON } from "../types/response";
import getLastId from "../utils/lastId";
import { prisma } from "../middleware/PrismMiddleware";

export default class ApplicationController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { internshipId, type } = req.body;

      const student = await prisma.student.findUniqueOrThrow({
        where: {
          id: Number(req.cookies.id),
          NOT: {
            document: null,
          },
        },
      });

      const internship = await prisma.internship.findUniqueOrThrow({
        where: {
          id: Number(internshipId),
        },
      });

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
      const { studentId, internshipId, status } = req.query as unknown as ApplicationDTO;
      const applications = await prisma.application.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          studentId: studentId ? Number(studentId) : undefined,
          internshipId: internshipId ? Number(internshipId) : undefined,
          status: status ? status : undefined,
        },
        omit: {
          studentId: true,
        },
        include: {
          student: true,
        },
      });
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
      const { studentId, internshipId, status } = req.query as unknown as ApplicationDTO;
      const { id } = req.params;
      const applications = await prisma.application.findMany({
        skip: 1,
        cursor: {
          id: Number(id),
        },
        where: {
          studentId: studentId ? Number(studentId) : undefined,
          internshipId: internshipId ? Number(internshipId) : undefined,
          status: status ? status : undefined,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
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

      const internship = await prisma.internship.findUniqueOrThrow({
        where: { id: application.internshipId },
      });
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
