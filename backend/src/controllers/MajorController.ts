import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export default class MajorController {
  public async all(req: Request, res: Response) {
    try {
      const majors = await prisma.major.findMany();
      if (majors.length === 0) {
        return res.status(204).json({ success: true, message: "no majors yet" });
      }
      return res.status(200).json({ success: true, message: "majors retrieved successfully", data: majors });
    } catch (error) {
      return res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
}
