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

export default function accessMiddleware(
  requiredAccounts: Array<"employee" | "company" | "student"> | "none"
) {
  if (
    requiredAccounts !== "none" &&
    (!Array.isArray(requiredAccounts) || requiredAccounts.length === 0)
  ) {
    throw new Error(
      "requiredAccounts must be 'none' or a non-empty array of valid account types"
    );
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
          message:
            "Missing JWT secret. Please set the JWT_SECRET environment variable.",
        });
      }

      const decoded: DecodedToken = jwt.verify(
        token,
        jwtSecret
      ) as DecodedToken;

      if (requiredAccounts === "none") {
        // If requiredAccounts is "none", only validate the token
        return next();
      }

      if (!requiredAccounts.includes(decoded.account)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      let user;
      switch (decoded.account) {
        case "employee":
          user = await prisma.employee.findUnique({
            where: { id: decoded.id },
          });
          break;
        case "company":
          user = await prisma.company.findUnique({
            where: { id: decoded.id },
          });
          break;
        case "student":
          user = await prisma.student.findUnique({
            where: { id: decoded.id },
          });
          break;
        default:
          return res.status(400).json({
            success: false,
            message: "Invalid account type",
          });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: `${decoded.account} not found`,
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
}
