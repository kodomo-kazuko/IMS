import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { jwtSecretKey, limit, prisma } from "../utils/const";
import getLastId from "../utils/lastId";
import notFound from "../utils/not-found";

export default class MentorController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { name, position, email, phone, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.mentor.create({
        data: {
          name,
          position,
          email,
          phone,
          password: hashedPassword,
          companyId: req.cookies.id,
        },
      });
      res.status(201).json({ success: true, message: "Mentor created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async single(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const mentor = await prisma.mentor.findUnique({
        where: { id: Number(id) },
      });
      notFound(mentor, "mentor");
      res
        .status(200)
        .json({ success: true, message: "Mentor retrieved successfully", data: mentor });
    } catch (error) {
      next(error);
    }
  }

  public async singleCompany(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const mentor = await prisma.mentor.findUnique({
        where: { id: Number(id), companyId: req.cookies.id },
      });
      notFound(mentor, "mentor");
      res
        .status(200)
        .json({ success: true, message: "Mentor retrieved successfully", data: mentor });
    } catch (error) {
      next(error);
    }
  }

  public async signin(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const mentor = await prisma.mentor.findUnique({
        where: { email },
        omit: {
          password: false,
        },
      });
      notFound(mentor, "mentor");
      const isPasswordValid = await bcrypt.compare(password, mentor.password);
      notFound(isPasswordValid, "password");

      const token = jwt.sign({ id: mentor.id, account: "mentor" }, jwtSecretKey, {
        expiresIn: "7d",
      });
      res.status(200).json({ success: true, message: "Authentication successful", data: token });
    } catch (error) {
      next(error);
    }
  }

  public async company(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const mentors = await prisma.company
        .findUnique({
          where: {
            id: req.cookies.id,
          },
        })
        .mentors({
          orderBy: {
            createdAt: "desc",
          },
        });
      notFound(mentors, "mentors");
      res
        .status(200)
        .json({ success: true, message: "Mentors retrieved successfully", data: mentors });
    } catch (error) {
      next(error);
    }
  }

  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const mentors = await prisma.mentor.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
      notFound(mentors, "mentors");
      const lastId = getLastId(mentors);
      res.status(200).json({
        success: true,
        message: "Mentors retrieved successfully",
        data: { lastId, list: mentors },
      });
    } catch (error) {
      next(error);
    }
  }
  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const mentors = await prisma.mentor.findMany({
        take: limit,
        skip: 1,
        orderBy: {
          createdAt: "desc",
        },
        cursor: {
          id: Number(id),
        },
      });
      notFound(mentors, "mentors");
      const lastId = getLastId(mentors);
      res.status(200).json({
        success: true,
        message: "Mentors retrieved successfully",
        data: { lastId, list: mentors },
      });
    } catch (error) {
      next(error);
    }
  }
}
