import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { updateURL } from "../utils/urlUpdate";
import path from "path";
import { getFilePath, saveFileToDisk } from "../utils/fileHandler";

const prisma = new PrismaClient();

export default class ApplicationController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content, internshipId } = req.body;
      const companyId = req.cookies.id;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const relativePath = "/uploads/images";
      const filePath = getFilePath(relativePath, req.file);

      await saveFileToDisk(req.file, path.join(__dirname, "..", filePath));

      await prisma.post.create({
        data: {
          title,
          content,
          companyId: Number(companyId),
          internshipId: Number(internshipId),
          image: filePath,
        },
      });

      res.status(201).json({ success: true, message: "Post created successfully" });
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
