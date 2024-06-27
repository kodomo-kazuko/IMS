import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export default class MentorController {
  public async create(req: Request, res: Response, next: NextFunction) {
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

  public async single(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const mentor = await prisma.mentor.findUnique({
        where: { id: Number(id) },
      });
      if (!mentor) {
        res.status(404).json({ success: false, message: "Mentor not found" });
        return;
      }
      res.status(200).json({ success: true, message: "Mentor retrieved successfully", data: mentor });
    } catch (error) {
      next(error);
    }
  }

  public async singleCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const mentor = await prisma.mentor.findUnique({
        where: { id: Number(id), companyId: req.cookies.id },
      });
      if (!mentor) {
        res.status(404).json({ success: false, message: "Mentor not found" });
        return;
      }
      res.status(200).json({ success: true, message: "Mentor retrieved successfully", data: mentor });
    } catch (error) {
      next(error);
    }
  }

  public async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const mentor = await prisma.mentor.findUnique({
        where: { email },
      });
      if (!mentor) {
        res.status(404).json({ success: false, message: "Mentor not found" });
        return;
      }
      const isPasswordValid = await bcrypt.compare(password, mentor.password);
      if (!isPasswordValid) {
        res.status(401).json({ success: false, message: "Invalid password" });
        return;
      }
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
      }
      const token = jwt.sign({ id: mentor.id, account: "mentor" }, jwtSecret, { expiresIn: "7d" });
      res.status(200).json({ success: true, message: "Authentication successful", token });
    } catch (error) {
      next(error);
    }
  }

  public async company(req: Request, res: Response, next: NextFunction) {
    try {
      const mentors = await prisma.mentor.findMany({
        where: { companyId: req.cookies.id },
      });
      if (mentors.length === 0) {
        res.status(204).json({ success: true, message: "No mentors found" });
        return;
      }
      res.status(200).json({ success: true, message: "Mentors retrieved successfully", data: mentors });
    } catch (error) {
      next(error);
    }
  }

  public async all(req: Request, res: Response, next: NextFunction) {
    try {
      const mentors = await prisma.mentor.findMany();
      if (mentors.length === 0) {
        res.status(204).json({ success: true, message: "No mentors found" });
        return;
      }
      res.status(200).json({ success: true, message: "Mentors retrieved successfully", data: mentors });
    } catch (error) {
      next(error);
    }
  }
}
