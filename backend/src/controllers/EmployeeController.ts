import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export default class EmployeeController {
  public async signup(req: Request, res: Response) {
    // Implement your signup logic here
  }

  public async signin(req: Request, res: Response) {
    // Implement your signin logic here
  }

  public async index(req: Request, res: Response) {
    // Implement your index logic here
  }
}
