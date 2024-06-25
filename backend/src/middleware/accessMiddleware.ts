import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface DecodedToken {
  account: "employee" | "company" | "student";
  id: number;
  iat: number;
  exp: number;
}

const findUserMethods = {
  employee: (id: number) => prisma.employee.findUnique({ where: { id } }),
  company: (id: number) => prisma.company.findUnique({ where: { id } }),
  student: (id: number) => prisma.student.findUnique({ where: { id } }),
};

export default function accessMiddleware(requiredAccounts: Array<"employee" | "company" | "student"> | "all") {
  if (requiredAccounts !== "all" && (!Array.isArray(requiredAccounts) || requiredAccounts.length === 0)) {
    throw new Error("requiredAccounts must be 'all' or a non-empty array of valid account types");
  }

  return async (req: Request, res: Response, next: NextFunction) => {
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
        // If requiredAccounts is "all", only validate the token
        return next();
      }

      if (!requiredAccounts.includes(decoded.account)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const findUserMethod = findUserMethods[decoded.account];
      if (!findUserMethod) {
        return res.status(400).json({
          success: false,
          message: "Invalid account type",
        });
      }

      const user = await findUserMethod(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: `${decoded.account} not found`,
        });
      }

      req.cookies = decoded.id;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
}
