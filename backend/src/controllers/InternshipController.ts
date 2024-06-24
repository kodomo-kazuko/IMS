import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export default class InternshipController {
  public async create(req: Request, res: Response) {
    try {
      const { title, type, enrollmentEndDate, startDate, endDate } = req.body;

      const enrollISO = new Date(enrollmentEndDate).toISOString();
      const startISO = new Date(startDate).toISOString();
      const endISO = new Date(endDate).toISOString();

      const internship = await prisma.internship.create({
        data: {
          title,
          type,
          enrollmentEndDate: enrollISO,
          startDate: startISO,
          endDate: endISO,
          companyId: req.cookies,
        },
      });
      return res.status(200).json({ success: true, message: "internship created successfully" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
  public async all(req: Request, res: Response) {
    try {
      const internships = await prisma.internship.findMany();
      if (internships.length === 0) {
        return res.status(204).json({ success: true, message: "no internships found" });
      }

      return res.status(200).json({ success: true, message: "retrieved successfully", data: internships });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}
