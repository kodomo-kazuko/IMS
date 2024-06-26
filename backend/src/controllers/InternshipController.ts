import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export default class InternshipController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, type, enrollmentEndDate, startDate, endDate } = req.body;
      const enrollISO = new Date(enrollmentEndDate).toISOString();
      const startISO = new Date(startDate).toISOString();
      const endISO = new Date(endDate).toISOString();
      await prisma.internship.create({
        data: {
          title,
          type,
          enrollmentEndDate: enrollISO,
          startDate: startISO,
          endDate: endISO,
          companyId: req.cookies,
        },
      });
      res.status(201).json({ success: true, message: "Internship created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async all(req: Request, res: Response, next: NextFunction) {
    try {
      const internships = await prisma.internship.findMany();
      if (internships.length === 0) {
        res.status(204).json({ success: true, message: "No internships found" });
        return;
      }
      res.status(200).json({ success: true, message: "Internships retrieved successfully", data: internships });
    } catch (error) {
      next(error);
    }
  }
}
