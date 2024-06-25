import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const SERVER_IP = process.env.IP || "localhost";
const SERVER_PORT = process.env.PORT || 8080;

export default class PostController {
  public async create(req: Request, res: Response) {
    try {
      const { title, content, internshipId } = req.body;
      const image = req.url;
      const companyId = req.cookies;

      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          companyId: Number(companyId),
          internshipId: Number(internshipId),
          image,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: newPost,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  public async single(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
      });

      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      // Construct the complete image URL
      const imageUrl = `http://${SERVER_IP}:${SERVER_PORT}${post.image}`;

      return res.status(200).json({
        success: true,
        data: {
          ...post,
          image: imageUrl,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
  public async all(req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany();
      if (posts.length === 0) {
        return res.status(204).json({ success: true, message: "no posts found" });
      }
      return res.status(200).json({ success: true, message: "retrieved all posts", data: posts });
    } catch (error) {
      return res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
}
