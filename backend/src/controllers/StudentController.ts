import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { deleteFileOnDisk, saveFileToDisk } from "../utils/fileHandler";
import { jwtSecretKey } from "../utils/const";
import { prisma } from "../middleware/PrismMiddleware";
import notFound from "../utils/not-found";
import { AccountType } from "@prisma/client";
import { validatePassword } from "../utils/PasswordValidate";

const account: AccountType = "student";

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
      const student = await prisma.student.findUniqueOrThrow({
        where: { email },
        omit: {
          password: false,
        },
      });

      await validatePassword(password, student.password, res);

      const token = jwt.sign({ id: student.id, account, access: student.majorId }, jwtSecretKey, {
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
        omit: {
          majorId: true,
        },
        include: {
          major: true,
        },
        where: {
          name: {
            search: req.query.name ? String(req.query.name) : undefined,
          },
        },
      });
      res.status(200).json({
        success: true,
        message: "Students retrieved successfully",
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }
  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const students = await prisma.student.findMany({
        skip: 1,
        omit: {
          majorId: true,
        },
        include: {
          major: true,
        },
        cursor: {
          id: Number(req.params.id),
        },
        where: {
          name: {
            search: req.query.name ? String(req.query.name) : undefined,
          },
        },
      });
      res.status(200).json({
        success: true,
        message: "Students retrieved successfully",
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }
  public async createDocument(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const student = await prisma.student.findUniqueOrThrow({
        where: {
          id: req.cookies.id,
        },
      });
      notFound(req.file, "file");

      await prisma.student.update({
        where: { id: req.cookies.id },
        data: {
          document: req.file.filename,
        },
      });
      await saveFileToDisk(req.file, "documents");
      res.status(201).json({ success: true, message: "document uploaded successfully" });
    } catch (error) {
      next(error);
    }
  }
  public async single(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const student = await prisma.student.findUnique({
        where: {
          id: Number(req.params.id),
        },
      });
      res.status(200).json({ success: true, message: "retrieved student", data: student });
    } catch (error) {
      next(error);
    }
  }
  public async account(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const student = await prisma.student.findUnique({
        omit: {
          majorId: true,
        },
        include: {
          major: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id: req.cookies.id,
        },
      });

      notFound(student, "student");

      res.status(200).json({ success: true, message: "retrieved student", data: student });
    } catch (error) {
      next(error);
    }
  }
  public async uploadImage(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      await prisma.student.findUniqueOrThrow({
        where: {
          id: req.cookies.id,
          image: null,
        },
      });

      notFound(req.file, "file");

      await prisma.student.update({
        where: { id: req.cookies.id },
        data: {
          image: req.file.filename,
        },
      });
      await saveFileToDisk(req.file, "images");
      res.status(201).json({ success: true, message: "Image uploaded successfully" });
    } catch (error) {
      next(error);
    }
  }
  public async delete(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const student = await prisma.student.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      student.image ? deleteFileOnDisk(student.image, "images") : undefined;
      student.document ? deleteFileOnDisk(student.document, "documents") : undefined;
    } catch (error) {
      next(error);
    }
  }
  public async count(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const studentCount = await prisma.student.count();
      return res
        .status(200)
        .json({ success: true, message: "student count retrieved", data: studentCount });
    } catch (error) {}
  }
}
