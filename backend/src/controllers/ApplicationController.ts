import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { updateURL } from "../utils/urlUpdate";
import { saveFileToDisk } from "../utils/fileHandler";
import { ResponseJSON } from "../types/response";
const prisma = new PrismaClient();

export default class ApplicationController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { title, content, internshipId } = req.body;
      const companyId = req.cookies.id;

      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
      }

      await saveFileToDisk(req.file, "documents");

      await prisma.application.create({
        data: {
          studentId: req.cookies.id,
          internshipId: Number(internshipId),
          document: req.url,
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
      const fullApplications = updateURL(applications, "document", "documents");
      return res.status(200).json({ success: true, message: "successfully retirved applications", data: fullApplications });
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
      const fullApplications = updateURL(applications, "document", "documents");
      return res.status(200).json({ success: true, message: "successfully retirved applications", data: fullApplications });
    } catch (error) {
      next(error);
    }
  }
  public async single(req: Request, res: Response<ResponseJSON>, next: NextFunction) {}
}
