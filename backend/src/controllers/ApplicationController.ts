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
      const fullApplications = updateURL(applications, "document", "documents");
      return res.status(200).json({ success: true, message: "retrieved applications", data: fullApplications });
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
