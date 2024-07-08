import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { limit } from "../utils/const";
import getLastId from "../utils/lastId";

const prisma = new PrismaClient();

export default class RoleController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { name } = req.body;
      await prisma.role.create({
        data: {
          name,
        },
      });
      return res.status(201).json({
        success: true,
        message: "Role created successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const roles = await prisma.role.findMany({
        take: limit,
        orderBy: {
          id: "desc",
        },
      });
      const lastId = getLastId(roles);
      return res.status(200).json({
        success: true,
        message: "stuff",
        data: {
          lastId,
          list: roles,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const roles = await prisma.role.findMany({
        take: limit,
        skip: 1,
        cursor: {
          id: Number(id),
        },
        orderBy: {
          id: "desc",
        },
      });
      const lastId = getLastId(roles);
      return res.status(200).json({
        success: true,
        message: "stuff",
        data: {
          lastId,
          list: roles,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
