import { InternshipType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import getLastId from "../utils/lastId";
import { prisma } from "../middleware/PrismMiddleware";

export default class InternshipController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { title, type, enrollmentEndDate, startDate, endDate, salary } = req.body;
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
          companyId: req.cookies.id,
          salary,
        },
      });
      res.status(201).json({ success: true, message: "Internship created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const companyId = Number(req.query.companyId);
      const internships = await prisma.internship.findMany({
        where: {
          companyId: companyId ? companyId : undefined,
        },
      });
      const lastId = getLastId(internships);
      res.status(200).json({
        success: true,
        message: "Internships retrieved successfully",
        data: {
          lastId,
          list: internships,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const companyId = Number(req.query.companyId);
      const { id } = req.params;
      const internships = await prisma.internship.findMany({
        skip: 1,
        cursor: {
          id: Number(id),
        },
        where: {
          companyId: companyId ? companyId : undefined,
        },
      });
      const lastId = getLastId(internships);
      res.status(200).json({
        success: true,
        message: "Internships retrieved successfully",
        data: {
          lastId,
          list: internships,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async types(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const internshipTypes = Object.values(InternshipType);
      res
        .status(200)
        .json({ success: true, message: "retrieved internship types", data: internshipTypes });
    } catch (error) {
      next(error);
    }
  }
  public async single(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const internship = await prisma.internship.findUniqueOrThrow({
        where: {
          id: Number(id),
        },
      });
      res.status(200).json({ success: true, message: "internship retrieved", data: internship });
    } catch (error) {
      next(error);
    }
  }
}
