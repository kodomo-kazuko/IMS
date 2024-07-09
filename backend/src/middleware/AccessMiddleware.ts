import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AccountType } from "../types/types";
import { ResponseJSON } from "../types/response";
import { prisma } from "../utils/const";

interface DecodedToken {
  account: AccountType;
  id: number;
  iat: number;
  exp: number;
  access?: number;
}

const findUserMethods = {
  employee: (id: number) => prisma.employee.findUnique({ where: { id } }),
  company: (id: number) => prisma.company.findUnique({ where: { id } }),
  student: (id: number) => prisma.student.findUnique({ where: { id } }),
  mentor: (id: number) => prisma.mentor.findUnique({ where: { id } }),
};

export default function accessMiddleware(
  requiredAccounts: AccountType[] | "all",
  requiredAccessLevel?: number
) {
  if (
    requiredAccounts !== "all" &&
    (!Array.isArray(requiredAccounts) || requiredAccounts.length === 0)
  ) {
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

      if (requiredAccounts !== "all" && !requiredAccounts.includes(decoded.account)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: Invalid account type",
        });
      }

      if (requiredAccessLevel !== undefined) {
        const userAccessLevel = decoded.access ?? 10;
        if (userAccessLevel > requiredAccessLevel) {
          return res.status(403).json({
            success: false,
            message: "Access denied: Insufficient access level",
          });
        }
      }

      req.cookies = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
}
