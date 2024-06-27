import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();
const SERVER_IP = process.env.IP || "localhost";
const SERVER_PORT = process.env.PORT || 8080;

export default class ApplicationController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { internshipId } = req.body;
      await prisma.application.create({
        data: {
          internshipId: Number(internshipId),
          studentId: req.cookies.id,
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
      const { id } = req.params;
      const student = await prisma.student.findUnique({
        where: { id: Number(id) },
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

      return res.status(200).json({ success: true, message: "Applications retrieved successfully.", data: applications });
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
      const fullApplications = applications.map((app) => ({
        ...app,
        document: `http://${SERVER_IP}:${SERVER_PORT}${app.document}`,
      }));
      return res.status(200).json({ success: true, message: "successfully retirved applications", data: fullApplications });
    } catch (error) {
      next(error);
    }
  }
  public async single(req: Request, res: Response, next: NextFunction) {}
}
