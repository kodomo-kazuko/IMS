import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResponseJSON } from "../types/response";
import { jwtSecretKey, limit } from "../utils/const";
import getLastId from "../utils/lastId";
import { prisma } from "../utils/const";
import notFound from "../utils/not-found";
import { AccountType } from "../types/types";

const account: AccountType = "company";

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
      res.status(201).json({ success: true, message: "Company registered successfully" });
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
      notFound(company, "company");
      const isPasswordValid = await bcrypt.compare(password, company.password);
      notFound(isPasswordValid, "password");

      const access = !company.isApproved;

      const token = jwt.sign({ id: company.id, account, access: Number(access) }, jwtSecretKey, {
        expiresIn: "7d",
      });
      res.status(200).json({ success: true, message: "Authentication successful", data: token });
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
      notFound(companies, "companies");
      const lastId = getLastId(companies);
      res.status(200).json({
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
      notFound(companies, "companies");
      const lastId = getLastId(companies);
      res.status(200).json({
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
      res.status(200).json({ success: true, message: "Company approval updated successfully" });
    } catch (error) {
      next(error);
    }
  }
  public async account(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const company = await prisma.company.findUnique({
        where: {
          id: req.cookies.id,
        },
      });
      notFound(company, "company");
      res.status(200).json({ success: true, message: "company details retrieved", data: company });
    } catch (error) {
      next(error);
    }
  }
}
