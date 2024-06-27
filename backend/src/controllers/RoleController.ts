import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export default class RoleController {
  public async all(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await prisma.role.findMany();
      return res.status(200).json({ success: true, roles });
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      await prisma.role.create({
        data: {
          name,
        },
      });
      return res.status(201).json({ success: true, message: "Role created" });
    } catch (error) {
      next(error);
    }
  }
}