import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";

const prisma = new PrismaClient();

export default class StudentInternshipController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.body;
      const application = await prisma.application.findUniqueOrThrow({
        where: {
          id: Number(id),
        },
      });
      if (!application) {
        return res.status(404).json({ success: false, message: "application not found" });
      }
      if (application.status !== "APPROVED") {
        return res.status(400).json({ success: false, message: "application is not approved" });
      }
      await prisma.studentInternship.create({
        data: {
          studentId: Number(req.cookies.id),
          internshipId: application.internshipId,
          type: application.type,
          status: "PENDING",
        },
      });
      return res.status(200).json({ success: true, message: "internship pending!" });
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
}
