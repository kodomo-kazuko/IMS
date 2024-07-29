import { InternshipType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
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
          title: req.query.title ? String(req.query.title) : undefined,
        },
        omit: {
          companyId: true,
        },
        include: {
          company: true,
        },
      });
      res.status(200).json({
        success: true,
        message: "Internships retrieved successfully",
        data: internships,
      });
    } catch (error) {
      next(error);
    }
  }
  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const companyId = Number(req.query.companyId);
      const internships = await prisma.internship.findMany({
        skip: 1,
        cursor: {
          id: Number(req.params.id),
        },
        where: {
          companyId: companyId ? companyId : undefined,
          title: req.query.title ? String(req.query.title) : undefined,
        },
        omit: {
          companyId: true,
        },
        include: {
          company: true,
        },
      });
      res.status(200).json({
        success: true,
        message: "Internships retrieved successfully",
        data: internships,
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
      const internship = await prisma.internship.findUniqueOrThrow({
        where: {
          id: Number(req.params.id),
        },
      });
      res.status(200).json({ success: true, message: "internship retrieved", data: internship });
    } catch (error) {
      next(error);
    }
  }
  public async count(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const internshipCount = await prisma.internship.count();
      return res
        .status(200)
        .json({ success: true, message: "internship count retrieved", data: internshipCount });
    } catch (error) {}
  }
  public async delete(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      await prisma.internship.delete({
        where: {
          id: Number(req.params.id),
          companyId: req.cookies.id,
        },
      });
      res.status(200).json({ success: true, message: "internship deleted" });
    } catch (error) {
      next(error);
    }
  }
}
