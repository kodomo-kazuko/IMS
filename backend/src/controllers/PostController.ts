import { Request, Response, NextFunction } from "express";
import { updateURL } from "../utils/urlUpdate";
import { deleteFileOnDisk, saveFileToDisk } from "../utils/fileHandler";
import { ResponseJSON } from "../types/response";
import { limit } from "../utils/const";
import getLastId from "../utils/lastId";
import { prisma } from "../utils/const";
import notFound from "../utils/not-found";

export default class PostController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { title, content, internshipId } = req.body;

      notFound(req.file, "file");

      await prisma.post.create({
        data: {
          title,
          content,
          companyId: req.cookies.id,
          internshipId: Number(internshipId),
          image: req.file.filename,
        },
      });
      await saveFileToDisk(req.file, "images");

      res.status(201).json({ success: true, message: "Post created successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async single(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
      });

      notFound(post, "post");

      const newPost = updateURL(post, ["image"]);
      res.status(200).json({ success: true, data: newPost, message: "post retrieved" });
    } catch (error) {
      next(error);
    }
  }

  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const posts = await prisma.post.findMany({
        include: {
          company: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
      notFound(posts, "posts");
      const postsWithFullUrls = updateURL(posts, ["image"]);
      const lastId = getLastId(posts);
      res.status(200).json({
        success: true,
        message: "Retrieved all posts",
        data: {
          lastId,
          list: postsWithFullUrls,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const posts = await prisma.post.findMany({
        cursor: {
          id: Number(id),
        },
        take: limit,
        skip: 1,
      });
      notFound(posts, "post");
      const postsWithFullUrls = updateURL(posts, ["image"]);
      const lastId = getLastId(posts);
      res.status(200).json({
        success: true,
        message: "Retrieved all posts",
        data: {
          lastId,
          list: postsWithFullUrls,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public async company(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const companyPosts = await prisma.company
        .findUnique({
          where: {
            id: req.cookies.id,
          },
        })
        .posts();
      notFound(companyPosts, "company posts");
      const updatedPosts = updateURL(companyPosts, ["image"]);
      res.status(200).json({ success: true, message: "Retrieved posts", data: updatedPosts });
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await prisma.post.delete({
        where: {
          id: Number(id),
          companyId: req.cookies.id,
        },
      });
      deleteFileOnDisk(post.image, "images");
      return res.status(200).json({ success: true, message: "post deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async editData(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, content, internshipId } = req.body;

      const existingPost = await prisma.post.findUnique({
        where: { id: Number(id) },
      });

      notFound(existingPost, "post");

      await prisma.post.update({
        where: { id: Number(id) },
        data: {
          title,
          content,
          internshipId: Number(internshipId),
        },
      });

      res.status(200).json({ success: true, message: "Post updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async editImage(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingPost = await prisma.post.findUnique({
        where: { id: Number(id) },
      });

      notFound(existingPost, "post");

      let image = existingPost.image;
      if (req.file) {
        await deleteFileOnDisk(image, "images");
        await saveFileToDisk(req.file, "images");
        image = req.file.filename;
      }

      await prisma.post.update({
        where: { id: Number(id) },
        data: { image },
      });

      res.status(200).json({ success: true, message: "Post image updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}
