import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { jwtSecretKey } from "../utils/const";
import getLastId from "../utils/lastId";
import { prisma } from "../middleware/PrismMiddleware";
import { validatePassword } from "../utils/PasswordValidate";
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
      const mentor = await prisma.mentor.findUniqueOrThrow({
        where: { id: Number(id) },
      });
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

      validatePassword(password, mentor.password);

      const token = jwt.sign({ id: mentor.id, account: "mentor" }, jwtSecretKey, {
        expiresIn: "7d",
      });
      res.status(200).json({ success: true, message: "Authentication successful", data: token });
    } catch (error) {
      next(error);
    }
  }

  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { companyId } = req.query;
      const mentors = await prisma.mentor.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          companyId: companyId ? Number(companyId) : undefined,
        },
      });
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
      const { companyId } = req.query;
      const { id } = req.params;
      const mentors = await prisma.mentor.findMany({
        skip: 1,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          companyId: companyId ? Number(companyId) : undefined,
        },
        cursor: {
          id: Number(id),
        },
      });
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
  public async delete(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.mentor.delete({
        where: {
          id: Number(id),
          companyId: req.cookies.id,
        },
      });
      return res.status(200).json({ success: true, message: "mentor deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
