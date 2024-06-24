import createRedisClient from "../redis";

const redisClient = createRedisClient();

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export default class MajorController {
  public async all(req: Request, res: Response) {
    try {
      // Check if data exists in Redis cache
      const cachedData = await redisClient.get("majors");
      if (cachedData) {
        const majors = JSON.parse(cachedData);
        return res.status(200).json({ success: true, message: "Majors retrieved from cache", data: majors });
      }

      // If not in cache, fetch from Prisma
      const majors = await prisma.major.findMany();
      if (majors.length === 0) {
        return res.status(204).json({ success: true, message: "No majors yet" });
      }

      // Cache the data for future requests
      await redisClient.set("majors", JSON.stringify(majors));

      return res.status(200).json({ success: true, message: "Majors retrieved successfully", data: majors });
    } catch (error) {
      return res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
}
