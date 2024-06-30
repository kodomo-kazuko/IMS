import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResponseJSON } from "../types/response";

const prisma = new PrismaClient({
  omit: {
    employee: {
      password: true,
    },
  },
});

export default class EmployeeController {
  public async signup(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    const { name, email, password, roleId, phone } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.employee.create({
        data: {
          name,
          email,
          roleId,
          password: hashedPassword,
          phone,
        },
      });
      res.status(201).json({ success: true, message: "Employee created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async signin(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const employee = await prisma.employee.findUnique({
        where: { email },
        omit: {
          password: false,
        },
      });
      if (!employee) {
        res.status(404).json({ success: false, message: "Employee not found" });
        return;
      }
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        res.status(401).json({ success: false, message: "Invalid password" });
        return;
      }
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
      }
      const token = jwt.sign({ id: employee.id, account: "employee" }, jwtSecret, { expiresIn: "7d" });
      res.status(200).json({ success: true, message: "Authentication successful", data: token });
    } catch (error) {
      next(error);
    }
  }

  public async all(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const employees = await prisma.employee.findMany();
      res.status(200).json({ success: true, message: "Employees retrieved successfully", data: employees });
    } catch (error) {
      next(error);
    }
  }
}
