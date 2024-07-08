import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResponseJSON } from "../types/response";
import { limit } from "../utils/const";
import getLastId from "../utils/lastId";
import { prisma } from "../utils/const";

export default class CompanyController {
  public async signup(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { name, email, password, phone, address, weburl } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.company.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          address,
          weburl,
        },
      });
      return res.status(201).json({ success: true, message: "Company registered successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async signin(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const company = await prisma.company.findUnique({
        where: { email },
        omit: {
          password: false,
        },
      });
      if (!company) {
        return res.status(404).json({ success: false, message: "Company not found" });
      }
      const isPasswordValid = await bcrypt.compare(password, company.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
      }
      const token = jwt.sign({ id: company.id, account: "company" }, jwtSecret, { expiresIn: "7d" });
      return res.status(200).json({ success: true, message: "Authentication successful", data: token });
    } catch (error) {
      next(error);
    }
  }

  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const companies = await prisma.company.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });
      if (companies.length === 0) {
        return res.status(200).json({ success: true, message: "no companies yet" });
      }
      const lastId = getLastId(companies);
      return res.status(200).json({
        success: true,
        message: "Companies retrieved successfully",
        data: {
          lastId,
          list: companies,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const companies = await prisma.company.findMany({
        orderBy: {
          createdAt: "desc",
        },
        cursor: {
          id: Number(id),
        },
        take: limit,
        skip: 1,
      });
      if (companies.length === 0) {
        return res.status(200).json({ success: true, message: "no companies yet" });
      }
      const lastId = getLastId(companies);
      return res.status(200).json({
        success: true,
        message: "Companies retrieved successfully",
        data: {
          lastId,
          list: companies,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public async approve(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { companyId } = req.body;
      await prisma.company.update({
        where: { id: companyId },
        data: { isApproved: true },
      });
      return res.status(200).json({ success: true, message: "Company approval updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}
