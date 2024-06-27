import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export default class StudentController {
  public async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, majorId, phone, address } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.student.create({
        data: {
          name,
          email,
          password: hashedPassword,
          majorId,
          phone,
          address,
        },
      });
      res.status(201).json({ success: true, message: "New student created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const student = await prisma.student.findUnique({ where: { email } });
      if (!student) {
        res.status(404).json({ success: false, message: "Email or password invalid" });
        return;
      }
      const isValidPassword = await bcrypt.compare(password, student.password);
      if (!isValidPassword) {
        res.status(401).json({ success: false, message: "Email or password invalid" });
        return;
      }
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
      }
      const token = jwt.sign({ id: student.id, account: "student" }, jwtSecret, { expiresIn: "7d" });
      res.status(200).json({ success: true, message: "Authentication successful", token });
    } catch (error) {
      next(error);
    }
  }

  public async index(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await prisma.student.findMany();
      if (students.length === 0) {
        res.status(204).json({ success: true, message: "No students found" });
        return;
      }
      res.status(200).json({ success: true, message: "Students retrieved successfully", data: students });
    } catch (error) {
      next(error);
    }
  }
}
