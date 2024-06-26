import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();
const SERVER_IP = process.env.IP || "localhost";
const SERVER_PORT = process.env.PORT || 8080;

export default class PostController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content, internshipId } = req.body;
      const image = req.url;
      const companyId = req.cookies;
      await prisma.post.create({
        data: {
          title,
          content,
          companyId: Number(companyId),
          internshipId: Number(internshipId),
          image,
        },
      });
      res.status(201).json({ success: true, message: "Post created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async single(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
      });
      if (!post) {
        res.status(404).json({ success: false, message: "Post not found" });
        return;
      }
      const imageUrl = `http://${SERVER_IP}:${SERVER_PORT}${post.image}`;
      res.status(200).json({ success: true, data: { ...post, image: imageUrl } });
    } catch (error) {
      next(error);
    }
  }

  public async all(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await prisma.post.findMany();
      if (posts.length === 0) {
        res.status(204).json({ success: true, message: "No posts found" });
        return;
      }
      res.status(200).json({ success: true, message: "Retrieved all posts", data: posts });
    } catch (error) {
      next(error);
    }
  }
}
