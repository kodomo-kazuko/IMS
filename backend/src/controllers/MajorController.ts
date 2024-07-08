import createRedisClient from "../redis";
import { Major } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { ResponseJSON } from "../types/response";
import { prisma } from "../utils/const";
const redisClient = createRedisClient();

export default class MajorController {
  private updateCache = async () => {
    const majors = await prisma.major.findMany();
    await redisClient.set("majors", JSON.stringify(majors));
  };

  public create = async (req: Request, res: Response<ResponseJSON>, next: NextFunction) => {
    try {
      const { name } = req.body;
      await prisma.major.create({
        data: { name },
      });

      await redisClient.del("majors");
      await this.updateCache();

      res.status(201).json({ success: true, message: "Major was added successfully" });
    } catch (error) {
      next(error);
    }
  };

  public all = async (req: Request, res: Response<ResponseJSON>, next: NextFunction) => {
    try {
      const cachedData = await redisClient.get("majors");
      if (cachedData) {
        const majors: Major[] = JSON.parse(cachedData);
        res.status(200).json({ success: true, message: "Majors retrieved from cache", data: majors });
        return;
      }
      const majors = await prisma.major.findMany();
      if (majors.length === 0) {
        res.status(200).json({ success: true, message: "No majors yet" });
        return;
      }
      await redisClient.set("majors", JSON.stringify(majors));
      res.status(200).json({ success: true, message: "Majors retrieved successfully", data: majors });
    } catch (error) {
      next(error);
    }
  };

  public edit = async (req: Request, res: Response<ResponseJSON>, next: NextFunction) => {
    try {
      const { id, name } = req.body;
      await prisma.major.update({
        where: { id: Number(id) },
        data: { name },
      });

      await redisClient.del("majors");
      await this.updateCache();

      res.status(200).json({ success: true, message: "Major updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response<ResponseJSON>, next: NextFunction) => {
    try {
      const { id } = req.params;
      await prisma.major.delete({
        where: { id: Number(id) },
      });

      await redisClient.del("majors");
      await this.updateCache();

      res.status(200).json({ success: true, message: "Major deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

const majorController = new MajorController();
export { majorController };
