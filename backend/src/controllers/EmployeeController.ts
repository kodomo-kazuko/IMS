import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResponseJSON } from "../types/response";
import { jwtSecretKey } from "../utils/const";
import { deleteFileOnDisk, saveFileToDisk } from "../utils/fileHandler";
import { AccountType } from "../types/types";
import { prisma } from "../middleware/PrismMiddleware";
import { validatePassword } from "../utils/PasswordValidate";
import notFound from "../utils/not-found";

const account: AccountType = "employee";

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
      const employee = await prisma.employee.findUniqueOrThrow({
        where: { email },
        omit: {
          password: false,
        },
      });

      await validatePassword(password, employee.password, res);

      const token = jwt.sign({ id: employee.id, account, access: employee.roleId }, jwtSecretKey, {
        expiresIn: "7d",
      });
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
      const employee = await prisma.employee.findUnique({
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
      res
        .status(200)
        .json({ success: true, message: "employee account retrieved", data: employee });
    } catch (error) {
      next(error);
    }
  }
  public async delete(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const employee = await prisma.employee.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      employee.image ? deleteFileOnDisk(employee.image, "images") : undefined;
    } catch (error) {
      next(error);
    }
  }
  public async uploadImage(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      await prisma.employee.findFirstOrThrow({
        where: {
          id: req.cookies.id,
          image: null,
        },
      });
      notFound(req.file, "image");

      await prisma.employee.update({
        where: {
          id: req.cookies.id,
        },
        data: {
          image: req.file.filename,
        },
      });
      await saveFileToDisk(req.file, "images");
      res.status(200).json({ success: true, message: "image uploaded" });
    } catch (error) {
      next(error);
    }
  }
}
