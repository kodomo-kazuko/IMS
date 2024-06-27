import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export default class ApplicationController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { internshipId } = req.body;
      await prisma.application.create({
        data: {
          internshipId,
          studentId: req.cookies.id,
        },
      });
      return res.status(201).json({ success: true, message: "Application created successfully." });
    } catch (error) {
      next(error);
      return res.status(500).json({ success: false, message: "An error occurred while creating the application." });
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
        return res.status(204).json({ success: true, message: "No application from this student yet." });
      }

      return res.status(200).json({ success: true, message: "Applications retrieved successfully.", data: applications });
    } catch (error) {
      next(error);
      return res.status(500).json({ success: false, message: "An error occurred while retrieving the applications." });
    }
  }
}
