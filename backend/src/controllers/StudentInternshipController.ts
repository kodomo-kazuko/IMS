import { InternshipStatus } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { prisma } from "../middleware/PrismMiddleware";
import notFound from "../utils/not-found";

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

      await prisma.studentInternship.create({
        data: {
          studentId: Number(req.cookies.id),
          internshipId: application.internshipId,
          type: application.type,
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
  public async company(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const studentInternships = await prisma.studentInternship.findMany({
        where: {
          internship: {
            companyId: req.cookies.id,
          },
        },
      });
      notFound(studentInternships, "student Internships");
      res.status(200).json({
        success: true,
        message: "company active internships retrieved ",
        data: studentInternships,
      });
    } catch (error) {
      next(error);
    }
  }

  public async student(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const studentInternships = await prisma.student
        .findUniqueOrThrow({
          where: {
            id: req.cookies.id,
          },
        })
        .internships({
          orderBy: {
            createdAt: "desc",
          },
        });
      notFound(studentInternships, "student Internships");
      res.status(200).json({
        success: true,
        message: "student internships retrieved",
        data: studentInternships,
      });
    } catch (error) {
      next(error);
    }
  }
  public async internships(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const internships = await prisma.internship
        .findUniqueOrThrow({
          where: {
            id: Number(id),
            companyId: req.cookies.id,
          },
        })
        .students({
          orderBy: {
            createdAt: "desc",
          },
          include: {
            student: true,
          },
        });
      res.status(200).json({ success: true, message: " students retrieved", data: internships });
    } catch (error) {
      next(error);
    }
  }
}
