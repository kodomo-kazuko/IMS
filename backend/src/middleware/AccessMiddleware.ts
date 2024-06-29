import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AccountType } from "../types/types";
import { ResponseJSON } from "../types/response";

const prisma = new PrismaClient();

interface DecodedToken {
  account: AccountType;
  id: number;
  iat: number;
  exp: number;
}

const findUserMethods = {
  employee: (id: number) => prisma.employee.findUnique({ where: { id } }),
  company: (id: number) => prisma.company.findUnique({ where: { id } }),
  student: (id: number) => prisma.student.findUnique({ where: { id } }),
  mentor: (id: number) => prisma.mentor.findUnique({ where: { id } }),
};

export default function accessMiddleware(requiredAccounts: AccountType[] | "all") {
  if (requiredAccounts !== "all" && (!Array.isArray(requiredAccounts) || requiredAccounts.length === 0)) {
    throw new Error("requiredAccounts must be 'all' or a non-empty array of valid account types");
  }

  return async (req: Request, res: Response<ResponseJSON>, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token found",
        });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({
          success: false,
          message: "Missing JWT secret. Please set the JWT_SECRET environment variable.",
        });
      }

      const decoded: DecodedToken = jwt.verify(token, jwtSecret) as DecodedToken;

      if (requiredAccounts === "all") {
        next();
        return;
      }

      if (!requiredAccounts.includes(decoded.account)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // uncomment for additional check

      // const findUserMethod = findUserMethods[decoded.account];
      // if (!findUserMethod) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Invalid account type",
      //   } );
      // }

      // const user = await findUserMethod(decoded.id);
      // if (!user) {
      //   return res.status(404).json({
      //     success: false,
      //     message: `${decoded.account} not found`,
      //   } );
      // }

      req.cookies = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
}
