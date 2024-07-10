import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { saveFileToDisk } from "../utils/fileHandler";
import { updateURL } from "../utils/urlUpdate";
import { jwtSecretKey, limit } from "../utils/const";
import getLastId from "../utils/lastId";
import { prisma } from "../utils/const";
import notFound from "../utils/not-found";

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
      notFound(student, "student");
      const isValidPassword = await bcrypt.compare(password, student.password);
      notFound(isValidPassword, "password");

      const token = jwt.sign({ id: student.id, account: "student" }, jwtSecretKey, {
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
      notFound(students, "students");
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
      notFound(students, "students");
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
  public async createDocument(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const student = await prisma.student.findUnique({
        where: {
          id: Number(req.cookies.id),
        },
      });
      notFound(student, "student");
      notFound(req.file, "file");

      await prisma.student.update({
        where: { id: Number(req.cookies.id) },
        data: {
          document: req.file.filename,
        },
      });
      await saveFileToDisk(req.file, "documents");
      return res.status(201).json({ success: true, message: "document uploaded successfully" });
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

      notFound(student.image, "image");

      notFound(req.file, "file");

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
