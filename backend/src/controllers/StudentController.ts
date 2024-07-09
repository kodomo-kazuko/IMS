import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { saveFileToDisk } from "../utils/fileHandler";
import { updateURL } from "../utils/urlUpdate";
import { limit } from "../utils/const";
import getLastId from "../utils/lastId";
import { prisma } from "../utils/const";

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
      const token = jwt.sign({ id: student.id, account: "student" }, jwtSecret, {
        expiresIn: "7d",
      });
      res.status(200).json({ success: true, message: "Authentication successful", data: token });
    } catch (error) {
      next(error);
    }
  }

  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const students = await prisma.student.findMany({
        take: limit,
        omit: {
          majorId: true,
        },
        include: {
          major: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (students.length === 0) {
        res.status(200).json({ success: true, message: "No students found" });
        return;
      }
      const updatedStudents = updateURL(students, ["document"]);
      const lastId = getLastId(students);
      res.status(200).json({
        success: true,
        message: "Students retrieved successfully",
        data: {
          lastId,
          list: updatedStudents,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const students = await prisma.student.findMany({
        take: limit,
        skip: 1,
        omit: {
          majorId: true,
        },
        include: {
          major: true,
        },
        cursor: {
          id: Number(id),
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (students.length === 0) {
        res.status(200).json({ success: true, message: "No students found" });
        return;
      }
      const lastId = getLastId(students);
      const updatedStudents = updateURL(students, ["document"]);
      res.status(200).json({
        success: true,
        message: "Students retrieved successfully",
        data: {
          lastId,
          list: updatedStudents,
        },
      });
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

      await prisma.student.update({
        where: { id: Number(req.cookies.id) },
        data: {
          document: req.file.filename,
        },
      });
      await saveFileToDisk(req.file, "documents");
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
        omit: {
          majorId: true,
        },
        include: {
          major: true,
        },
        where: {
          id: Number(req.cookies.id),
        },
      });
      const updatedStudent = updateURL(student, ["image", "document"]);
      return res
        .status(200)
        .json({ success: true, message: "retrieved student", data: updatedStudent });
    } catch (error) {
      next(error);
    }
  }
  public async uploadImage(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const student = await prisma.student.findUniqueOrThrow({
        where: {
          id: Number(req.cookies.id),
        },
      });

      if (student.image !== null) {
        return res.status(300).json({ success: false, message: "You already have an image" });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      await prisma.student.update({
        where: { id: Number(req.cookies.id) },
        data: {
          image: req.file.filename,
        },
      });
      await saveFileToDisk(req.file, "images");
      return res.status(201).json({ success: true, message: "Image uploaded successfully" });
    } catch (error) {
      next(error);
    }
  }
}
