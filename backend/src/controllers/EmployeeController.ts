import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResponseJSON } from "../types/response";
import { jwtSecretKey, prisma } from "../utils/const";
import notFound from "../utils/not-found";

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
      notFound(employee, "employee");
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      notFound(isPasswordValid, "password");

      const token = jwt.sign(
        { id: employee.id, account: "employee", access: employee.roleId },
        jwtSecretKey,
        {
          expiresIn: "7d",
        }
      );
      res.status(200).json({ success: true, message: "Authentication successful", data: token });
    } catch (error) {
      next(error);
    }
  }

  public async all(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const employees = await prisma.employee.findMany();
      res
        .status(200)
        .json({ success: true, message: "Employees retrieved successfully", data: employees });
    } catch (error) {
      next(error);
    }
  }
  public async account(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const employee = await prisma.employee.findUniqueOrThrow({
        omit: {
          roleId: true,
        },
        include: {
          role: true,
        },
        where: {
          id: req.cookies.id,
        },
      });
      notFound(employee, "employee");
      res
        .status(200)
        .json({ success: true, message: "employee account retrieved", data: employee });
    } catch (error) {
      next(error);
    }
  }
}
