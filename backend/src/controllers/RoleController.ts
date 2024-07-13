import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { prisma } from "../utils/const";

export default class RoleController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { name } = req.body;
      await prisma.role.create({
        data: {
          name,
        },
      });
      res.status(201).json({
        success: true,
        message: "Role created successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  public async all(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const roles = await prisma.role.findMany();
      res.status(200).json({
        success: true,
        message: "stuff",
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  }
  public async edit(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id, name } = req.body;
      await prisma.role.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
        },
      });
      res.status(200).json({ success: true, message: "role name updated" });
    } catch (error) {
      next(error);
    }
  }
  public async delete(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.role.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(200).json({ success: true, message: "role deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
