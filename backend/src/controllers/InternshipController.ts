import { InternshipType } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import getLastId from "../utils/lastId";
import { limit } from "../utils/const";
import { prisma } from "../utils/const";

export default class InternshipController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
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
          companyId: req.cookies.id,
        },
      });
      res.status(201).json({ success: true, message: "Internship created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const internships = await prisma.internship.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
      if (internships.length === 0) {
        res.status(200).json({ success: true, message: "No internships found" });
        return;
      }
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
      const { id } = req.params;
      const internships = await prisma.internship.findMany({
        take: limit,
        skip: 1,
        cursor: {
          id: Number(id),
        },
      });
      if (internships.length === 0) {
        res.status(200).json({ success: true, message: "No internships found" });
        return;
      }
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
      return res.status(200).json({ success: true, message: "retrieved internship types", data: internshipTypes });
    } catch (error) {
      next(error);
    }
  }
  public async company(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const companyInternships = await prisma.company
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
      return res.status(200).json({ success: true, message: "internships retrieved", data: { list: companyInternships } });
    } catch (error) {
      next(error);
    }
  }
}
