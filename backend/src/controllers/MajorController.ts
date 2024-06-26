import createRedisClient from "../redis";
import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const redisClient = createRedisClient();

const prisma = new PrismaClient();

export default class MajorController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const newMajor = await prisma.major.create({
        data: {
          name,
        },
      });
      const cachedData = await redisClient.get("majors");
      if (cachedData) {
        const majors = JSON.parse(cachedData);
        majors.push(newMajor);
        await redisClient.set("majors", JSON.stringify(majors));
      }
      res.status(201).json({ success: true, message: "Major was added successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async all(req: Request, res: Response, next: NextFunction) {
    try {
      const cachedData = await redisClient.get("majors");
      if (cachedData) {
        const majors = JSON.parse(cachedData);
        res.status(200).json({ success: true, message: "Majors retrieved from cache", data: majors });
        return;
      }
      const majors = await prisma.major.findMany();
      if (majors.length === 0) {
        res.status(204).json({ success: true, message: "No majors yet" });
        return;
      }
      await redisClient.set("majors", JSON.stringify(majors));
      res.status(200).json({ success: true, message: "Majors retrieved successfully", data: majors });
    } catch (error) {
      next(error);
    }
  }
}
