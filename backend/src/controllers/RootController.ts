import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Props, ResponseJSON } from "../types/response";

export default class RootController {
  public async tokenRenew(
    req: Request,
    res: Response<ResponseJSON>,
    next: NextFunction
  ): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
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
      const threeAndHalfDaysAgo = new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000);
      if (issuedAt < threeAndHalfDaysAgo) {
        const newToken = jwt.sign({ id: decoded.id }, jwtSecret, { expiresIn: "7d" });
        res
          .status(200)
          .json({ success: true, message: "Token renewed", data: { token: newToken } });
      } else {
        res.status(200).json({ success: true, message: "User is signed in" });
      }
    } catch (error) {
      next(error);
    }
  }

  public async check(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      res.status(200).json({ success: true, message: "Backend is running" });
    } catch (error) {
      next(error);
    }
  }
  public async test({ req, res, next }: Props) {
    try {
      return res.status(200).json({ success: true, message: "it worked" });
    } catch (error) {
      next(error);
    }
  }
}
