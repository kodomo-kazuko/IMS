import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AccountType } from "@prisma/client";
import { ResponseJSON } from "../types/response";
import { jwtSecretKey } from "../utils/const";

interface DecodedToken {
  account: AccountType;
  id: number;
  iat: number;
  exp: number;
  access: number;
}

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

      const decoded: DecodedToken = jwt.verify(token, jwtSecretKey) as DecodedToken;

      if (requiredAccounts !== "all" && !requiredAccounts.includes(decoded.account)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      if (requiredAccessLevel !== undefined) {
        const userAccessLevel = decoded.access ?? 10;
        if (userAccessLevel > requiredAccessLevel) {
          return res.status(403).json({
            success: false,
            message: "Access denied",
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
