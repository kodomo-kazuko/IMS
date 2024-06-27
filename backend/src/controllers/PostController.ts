import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { updateURL } from "../utils/urlUpdate";

const prisma = new PrismaClient();
const SERVER_IP = process.env.IP || "localhost";
const SERVER_PORT = process.env.PORT || 8080;

export default class PostController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content, internshipId } = req.body;
      const companyId = req.cookies.id;
      await prisma.post.create({
        data: {
          title,
          content,
          companyId: Number(companyId),
          internshipId: Number(internshipId),
          image: req.url,
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
      const newPost = updateURL(post, "image");
      res.status(200).json({ success: true, data: newPost });
    } catch (error) {
      next(error);
    }
  }

  public async all(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await prisma.post.findMany();
      if (posts.length === 0) {
        res.status(200).json({ success: true, message: "No posts found" });
        return;
      }
      const postsWithFullUrls = updateURL(posts, "image");

      res.status(200).json({ success: true, message: "Retrieved all posts", data: postsWithFullUrls });
    } catch (error) {
      next(error);
    }
  }
  public async company(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await prisma.post.findMany({
        where: { companyId: req.cookies.id },
      });
      if (posts.length === 0) {
        res.status(200).json({ success: true, message: "No posts found" });
        return;
      }
      const updatedPosts = updateURL(posts, "image");
      res.status(200).json({ success: true, message: "Retrieved posts", data: updatedPosts });
    } catch (error) {
      next(error);
    }
  }
}
