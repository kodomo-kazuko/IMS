import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export default class UserController {
  public async index(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json({ success: true, message: users });
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }

  public async create(req: Request, res: Response) {
    const { name, email } = req.body;
    try {
      // Check if a user with the same name or email already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ name: name }, { email: email }],
        },
      });

      if (existingUser) {
        res
          .status(400)
          .json({
            success: false,
            message: "User name or email is already being used",
          });
        return;
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
        },
      });
      res
        .status(201)
        .json({ success: true, message: `User ${name} created successfully` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
