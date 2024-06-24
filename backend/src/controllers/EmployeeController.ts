import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

interface SigninRequestBody {
  email: string;
  password: string;
}

export default class EmployeeController {
  public async signup(req: Request, res: Response) {
    const { name, email, password, roleId } = req.body as SignupRequestBody;
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create employee
      const employee = await prisma.employee.create({
        data: {
          name,
          email,
          roleId,
          password: hashedPassword,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Employee created successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  public async signin(req: Request, res: Response) {
    const { email, password } = req.body as SigninRequestBody;
    try {
      // Find employee by email
      const employee = await prisma.employee.findUnique({
        where: { email },
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, employee.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }

      // Generate token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = jwt.sign({ id: employee.id, account: "employee" }, jwtSecret, {
        expiresIn: "7d",
      });

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

  public async index(req: Request, res: Response) {
    try {
      // Get all employees
      const employees = await prisma.employee.findMany();

      return res.status(200).json({
        success: true,
        message: "Employees retrieved successfully",
        data: employees,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}
