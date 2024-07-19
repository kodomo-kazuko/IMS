import { InternshipStatus } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { prisma } from "../middleware/PrismMiddleware";
import notFound from "../utils/not-found";
import getLastId from "../utils/lastId";

export default class StudentInternshipController {
  public async types(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const internshipStatus = Object.values(InternshipStatus);
      res.status(200).json({
        success: true,
        message: "retrieved internship status types",
        data: internshipStatus,
      });
    } catch (error) {
      next(error);
    }
  }
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.body;

      const startedInternship = await prisma.studentInternship.findFirst({
        where: {
          studentId: req.cookies.id,
          internshipId: Number(id),
        },
      });
      if (startedInternship) {
        res.status(300).json({ success: false, message: "You already have an active internship." });
      }

      const application = await prisma.application.findUniqueOrThrow({
        where: {
          id: Number(id),
          studentId: req.cookies.id,
        },
      });

      if (application.status !== "APPROVED") {
        res.status(400).json({ success: false, message: "Application is not approved." });
      }

      const internship = await prisma.internship.findUniqueOrThrow({
        where: {
          id: Number(id),
        },
      });

      await prisma.studentInternship.create({
        data: {
          studentId: req.cookies.id,
          internshipId: application.internshipId,
          type: internship.type,
          status: "PENDING",
        },
      });

      res.status(200).json({ success: true, message: "Internship pending!" });
    } catch (error) {
      next(error);
    }
  }

  public async start(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id, mentorId } = req.body;
      const studentinertnship = await prisma.studentInternship.findUniqueOrThrow({
        where: {
          id: Number(id),
        },
      });
      const mentor = await prisma.mentor.findUniqueOrThrow({
        where: {
          id: Number(mentorId),
        },
      });
      if (mentor.companyId !== req.cookies.id) {
        res.status(400).json({ success: false, message: "mentor does not belong to this company" });
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
      res.status(200).json({ success: true, message: "internship started!" });
    } catch (error) {
      next(error);
    }
  }
  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { studentId, internshipId } = req.query;
      const studentInternship = await prisma.studentInternship.findMany({
        where: {
          studentId: studentId ? Number(studentId) : undefined,
          internshipId: internshipId ? Number(internshipId) : undefined,
        },
      });
      notFound(studentInternship, "student internships not found");
      const lastId = getLastId(studentInternship);
      res.status(200).json({
        success: true,
        message: "student internships retirved",
        data: {
          lastId,
          list: studentInternship,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { studentId, internshipId } = req.query;
      const studentInternship = await prisma.studentInternship.findMany({
        where: {
          studentId: studentId ? Number(studentId) : undefined,
          internshipId: internshipId ? Number(internshipId) : undefined,
        },
        cursor: {
          id: Number(req.params.id),
        },
        skip: 1,
      });
      notFound(studentInternship, "student internships not found");
      const lastId = getLastId(studentInternship);
      res.status(200).json({
        success: true,
        message: "student internships retirved",
        data: {
          lastId,
          list: studentInternship,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
