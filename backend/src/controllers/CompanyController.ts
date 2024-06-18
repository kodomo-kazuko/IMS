import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export default class CompanyController {
  public async signup(req: Request, res: Response) {}

  public async signin(req: Request, res: Response) {}

  public async index(req: Request, res: Response) {}
}
