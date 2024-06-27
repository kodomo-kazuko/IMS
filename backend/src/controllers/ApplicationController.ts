import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { updateURL } from "../utils/urlUpdate";

const prisma = new PrismaClient();

export default class ApplicationController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { internshipId } = req.body;
      const studentId = req.cookies.id;
      const existingApplication = await prisma.application.findFirst({
        where: {
          internshipId: Number(internshipId),
          studentId: Number(studentId),
        },
      });

      if (existingApplication) {
        return res.status(400).json({ success: false, message: "You've already applied to this internship." });
      }
      await prisma.application.create({
        data: {
          internshipId: Number(internshipId),
          studentId: Number(studentId),
          document: req.url,
        },
      });

      return res.status(201).json({ success: true, message: "Application created successfully." });
    } catch (error) {
      next(error);
    }
  }

  public async student(req: Request, res: Response, next: NextFunction) {
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
      const fullApplications = updateURL(applications, "document");
      return res.status(200).json({ success: true, message: "successfully retirved applications", data: fullApplications });
    } catch (error) {
      next(error);
    }
  }
  public async all(req: Request, res: Response, next: NextFunction) {
    try {
      const applications = await prisma.application.findMany();
      if (applications.length === 0) {
        return res.status(200).json({ success: true, message: "no applications yet" });
      }
      const fullApplications = updateURL(applications, "document");
      return res.status(200).json({ success: true, message: "successfully retirved applications", data: fullApplications });
    } catch (error) {
      next(error);
    }
  }
  public async single(req: Request, res: Response, next: NextFunction) {}
}
