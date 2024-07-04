import { PrismaClient, InternshipStatus } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";

const prisma = new PrismaClient();

export default class StudentInternshipController {
  public async types(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const internshipStatus = Object.values(InternshipStatus);
      return res.status(200).json({ success: true, message: "retrieved internship status types", data: internshipStatus });
    } catch (error) {
      next(error);
    }
  }
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.body;

      // Check if the student already has an active internship
      const existingInternship = await prisma.studentInternship.findFirst({
        where: {
          studentId: Number(req.cookies.id),
          status: "STARTED",
        },
      });
      console.log(existingInternship);
      if (existingInternship) {
        return res.status(300).json({ success: false, message: "You already have an active internship." });
      }

      // Find the application by ID
      const application = await prisma.application.findUniqueOrThrow({
        where: {
          id: Number(id),
          studentId: req.cookies.id,
        },
      });
      if (!application) {
        return res.status(404).json({ success: false, message: "Application not found." });
      }

      // Check if the application is approved
      if (application.status !== "APPROVED") {
        return res.status(400).json({ success: false, message: "Application is not approved." });
      }

      // Create a new student internship record
      await prisma.studentInternship.create({
        data: {
          studentId: Number(req.cookies.id),
          internshipId: application.internshipId,
          type: application.type,
          status: "PENDING",
        },
      });

      return res.status(200).json({ success: true, message: "Internship pending!" });
    } catch (error) {
      next(error);
    }
  }

  public async start(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { studentId, internshipId, mentorId } = req.body;
      const studentinertnship = await prisma.studentInternship.findUniqueOrThrow({
        where: {
          studentId_internshipId: {
            studentId: Number(studentId),
            internshipId: Number(internshipId),
          },
        },
      });
      if (!studentinertnship) {
        return res.status(404).json({ success: false, message: "student internship not found" });
      }
      const internship = await prisma.internship.findUniqueOrThrow({
        where: {
          id: Number(internshipId),
        },
      });
      if (!internship) {
        return res.status(404).json({ success: false, message: "internship not found" });
      }
      const mentor = await prisma.mentor.findUniqueOrThrow({
        where: {
          id: Number(mentorId),
        },
      });
      if (!mentor) {
        return res.status(404).json({ success: false, message: "mentor does not exist" });
      }
      if (mentor.companyId !== req.cookies.id) {
        return res.status(400).json({ success: false, message: "mentor does not belong to this company" });
      }
      await prisma.studentInternship.update({
        where: {
          studentId_internshipId: {
            studentId: studentinertnship.studentId,
            internshipId: studentinertnship.internshipId,
          },
        },
        data: {
          mentorId: mentor.id,
          status: "STARTED",
        },
      });
      return res.status(200).json({ success: true, message: "internship started!" });
    } catch (error) {
      next(error);
    }
  }
  public async company(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const studentInternships = await prisma.studentInternship.findMany({
        where: {
          internship: {
            companyId: req.cookies.id,
          },
        },
      });
      if (!studentInternships) {
        return res.status(400).json({ success: true, message: "no active internships" });
      }
      return res.status(200).json({ success: true, message: "company active internships retrieved ", data: studentInternships });
    } catch (error) {
      next(error);
    }
  }

  public async student(req: Request, res: Response<ResponseJSON>, next: NextFunction) {}
}
