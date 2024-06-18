import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default class UserController {
  public async checkToken(req: Request, res: Response): Promise<Response> {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

      if (!decoded.iat) {
        throw new Error("Invalid token");
      }

      const issuedAt = new Date(decoded.iat * 1000);
      const threeAndHalfDaysAgo = new Date(
        Date.now() - 3.5 * 24 * 60 * 60 * 1000
      );

      if (issuedAt < threeAndHalfDaysAgo) {
        const newToken = jwt.sign({ id: decoded.id }, jwtSecret, {
          expiresIn: "7d",
        });

        return res.status(200).json({
          success: true,
          message: "Token renewed",
          token: newToken,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "User is signed in",
        });
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}
