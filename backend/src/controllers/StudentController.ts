import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
  majorId: number;
}

interface SigninRequestBody {
  email: string;
  password: string;
}

export default class StudentController {
  public async signup(req: Request, res: Response) {
    try {
      const { name, email, password, majorId } = req.body as SignupRequestBody;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = await prisma.student.create({
        data: {
          name,
          email,
          password: hashedPassword,
          majorId,
        },
      });

      return res
        .status(200)
        .json({ success: true, message: "new Student created successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }

  public async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body as SigninRequestBody;

      const student = await prisma.student.findUnique({
        where: { email },
      });
      if (!student) {
        return res
          .status(404)
          .json({ success: false, message: "email or password Invalid" });
      }

      const ValidPassword = await bcrypt.compare(password, student.password);

      if (!ValidPassword) {
        return res
          .status(404)
          .json({ success: false, message: "email or password Invalid" });
      }

      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = jwt.sign(
        { id: student.id, account: "student" },
        jwtSecret,
        {
          expiresIn: "7d",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Authentication successful",
        token,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  public async index(req: Request, res: Response) {}
}
