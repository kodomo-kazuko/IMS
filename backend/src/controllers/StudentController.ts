import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { saveFileToDisk } from "../utils/fileHandler";
import { updateURL } from "../utils/urlUpdate";

const prisma = new PrismaClient({
  omit: {
    student: {
      password: true,
    },
  },
});

export default class StudentController {
  public async signup(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
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

  public async signin(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const student = await prisma.student.findUnique({
        where: { email },
        omit: {
          password: false,
        },
      });
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
      res.status(200).json({ success: true, message: "Authentication successful", data: token });
    } catch (error) {
      next(error);
    }
  }

  public async all(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const students = await prisma.student.findMany();
      if (students.length === 0) {
        res.status(200).json({ success: true, message: "No students found" });
        return;
      }
      const updatedStudents = updateURL(students, "document", "documents");
      res.status(200).json({ success: true, message: "Students retrieved successfully", data: updatedStudents });
    } catch (error) {
      next(error);
    }
  }
  public async createCV(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const student = await prisma.student.findUnique({
        where: {
          id: Number(req.cookies.id),
        },
      });
      if (student?.document) {
        return res.status(400).json({ success: false, message: "you already have a document" });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
      }

      await saveFileToDisk(req.file, "documents");
      await prisma.student.update({
        where: { id: Number(req.cookies.id) },
        data: {
          document: req.url,
        },
      });
      return res.status(201).json({ success: true, message: "created cv" });
    } catch (error) {
      next(error);
    }
  }
  public async single(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const student = await prisma.student.findUniqueOrThrow({
        where: {
          id: Number(id),
        },
      });
      return res.status(200).json({ success: true, message: "retrieved student", data: student });
    } catch (error) {
      next(error);
    }
  }
  public async account(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const student = await prisma.student.findUniqueOrThrow({
        where: {
          id: Number(req.cookies.id),
        },
      });
      return res.status(200).json({ success: true, message: "retrieved student", data: student });
    } catch (error) {
      next(error);
    }
  }
}
