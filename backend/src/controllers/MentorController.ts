import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default class MentorController {
  public async create(req: Request, res: Response) {
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
          companyId: req.cookies,
        },
      });
      return res.status(201).json({ success: true, message: "mentor created successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
  public async single(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mentor = await prisma.mentor.findUnique({
        where: { id: Number(id) },
      });

      if (!mentor) {
        return res.status(404).json({ success: false, message: "mentor not found" });
      }

      return res.status(201).json({ success: true, message: "mentor retrieved successfully", data: mentor });
    } catch (error) {
      return res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  public async singleCompany(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mentor = await prisma.mentor.findUnique({
        where: { id: Number(id), companyId: req.cookies },
      });

      if (!mentor) {
        return res.status(404).json({ success: false, message: "mentor not found" });
      }

      return res.status(201).json({ success: true, message: "mentor retrieved successfully", data: mentor });
    } catch (error) {
      return res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
  public async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const mentor = await prisma.mentor.findUnique({
        where: { email },
      });

      if (!mentor) {
        return res.status(404).json({
          success: false,
          message: "mentor not found",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, mentor.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = jwt.sign({ id: mentor.id, account: "mentor" }, jwtSecret, {
        expiresIn: "7d",
      });

      return res.status(200).json({
        success: true,
        message: "Authentication successful",
        token,
      });
    } catch (error) {}
  }
  public async comapny(req: Request, res: Response) {
    try {
      const mentors = await prisma.mentor.findMany({
        where: { companyId: req.cookies.id },
      });
      if (mentors.length === 0) {
        return res.status(204).json({ success: true, message: "no mentors found" });
      }
      return res.status(201).json({ success: true, message: "mentors retrieved successfully", data: mentors });
    } catch (error) {
      return res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
  public async all(req: Request, res: Response) {
    try {
      const mentors = await prisma.mentor.findMany();
      if (mentors.length === 0) {
        return res.status(204).json({ success: true, message: "no mentors found" });
      }
      return res.status(201).json({ success: true, message: "mentors retrieved successfully", data: mentors });
    } catch (error) {
      return res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
}
