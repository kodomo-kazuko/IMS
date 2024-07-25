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
      const studentId = req.cookies.id;
      const internshipId = Number(req.params.id);

      // Check if the student already has an active internship
      const startedInternship = await prisma.studentInternship.findFirst({
        where: {
          studentId,
          internshipId,
        },
      });

      if (startedInternship) {
        return res
          .status(409)
          .json({ success: false, message: "You already have an active internship." });
      }

      // Find the application
      const application = await prisma.application.findUniqueOrThrow({
        where: {
          id: internshipId,
          studentId,
        },
      });

      if (application.status !== "APPROVED") {
        return res.status(400).json({ success: false, message: "Application is not approved." });
      }

      // Find the internship
      const internship = await prisma.internship.findUniqueOrThrow({
        where: {
          id: application.internshipId,
        },
      });

      // Start a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Create the student internship
        const newInternship = await prisma.studentInternship.create({
          data: {
            studentId,
            internshipId: application.internshipId,
            type: internship.type,
            status: "PENDING",
          },
        });

        // Update the requirement
        const requirement = await prisma.requirement.findFirstOrThrow({
          where: {
            internshipId: internship.id,
            major: req.cookies.access,
          },
        });

        await prisma.requirement.update({
          where: {
            id: requirement.id,
          },
          data: {
            studentLimit: { decrement: 1 },
          },
        });

        // Cancel all other applications
        await prisma.application.updateMany({
          where: {
            studentId,
          },
          data: {
            status: "CANCELLED",
          },
        });

        return newInternship;
      });

      res.status(200).json({ success: true, message: "Internship started and is pending!" });
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
      res.status(200).json({
        success: true,
        message: "student internships retirved",
        data: studentInternship,
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
      res.status(200).json({
        success: true,
        message: "student internships retirved",
        data: studentInternship,
      });
    } catch (error) {
      next(error);
    }
  }
}
