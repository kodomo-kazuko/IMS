import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
const prisma = new PrismaClient();

export default class ApplicationController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { internshipId, type } = req.body;

      const student = await prisma.student.findUniqueOrThrow({
        where: {
          id: Number(req.cookies.id),
        },
      });

      if (!student.document) {
        return res.status(400).json({ success: false, message: "Document is missing." });
      }

      const application = await prisma.application.findFirst({
        where: {
          internshipId: Number(internshipId),
          studentId: Number(req.cookies.id),
        },
      });

      if (application) {
        return res.status(409).json({ success: false, message: "You have already applied to this internship." });
      }

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
      const student = await prisma.student.findUnique({
        where: { id: req.cookies.id },
      });
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found." });
      }

      const applications = await prisma.application.findMany({
        where: { studentId: student.id },
      });

      if (!applications || applications.length === 0) {
        return res.status(200).json({ success: true, message: "No application from this student yet." });
      }

      return res.status(200).json({ success: true, message: "successfully retirved applications", data: applications });
    } catch (error) {
      next(error);
    }
  }
  public async all(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const applications = await prisma.application.findMany();
      if (applications.length === 0) {
        return res.status(200).json({ success: true, message: "no applications yet" });
      }
      return res.status(200).json({ success: true, message: "successfully retirved applications", data: applications });
    } catch (error) {
      next(error);
    }
  }
  public async internship(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const company = await prisma.internship.findUniqueOrThrow({
        where: { companyId: Number(req.cookies.id), id: Number(id) },
      });
      if (!company) {
        return res.status(404).json({ success: false, message: "access denied" });
      }
      const applications = await prisma.application.findMany({
        where: {
          internshipId: Number(id),
        },
      });
      if (applications.length === 0) {
        return res.status(200).json({ success: true, message: "no applications yet" });
      }
      return res.status(200).json({ success: true, message: "retrieved applications", data: applications });
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

      if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
      }
      const internship = await prisma.internship.findUniqueOrThrow({
        where: { id: application.internshipId },
      });

      if (!internship) {
        return res.status(404).json({ success: false, message: "Internship not found" });
      }
      if (internship.companyId !== Number(req.cookies.id)) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      await prisma.application.update({
        where: { id: Number(id) },
        data: { status: "APPROVED" },
      });
      return res.status(200).json({ success: true, message: "Application approved successfully" });
    } catch (error) {
      next(error);
    }
  }
}
