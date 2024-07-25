import { Request, Response, NextFunction } from "express";
import { deleteFileOnDisk, saveFileToDisk } from "../utils/fileHandler";
import { ResponseJSON } from "../types/response";
import { prisma } from "../middleware/PrismMiddleware";
import notFound from "../utils/not-found";

export default class PostController {
  public async create(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { title, content, internshipId } = req.body;

      await prisma.internship.findUniqueOrThrow({
        where: {
          id: Number(internshipId),
          companyId: req.cookies.id,
        },
      });

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
      const post = await prisma.post.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          internship: true,
        },
        omit: {
          internshipId: true,
        },
      });
      res.status(200).json({ success: true, message: "post retrieved", data: post });
    } catch (error) {
      next(error);
    }
  }

  public async base(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const comapnyId = Number(req.query.comapnyId);
      const posts = await prisma.post.findMany({
        include: {
          company: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        where: {
          companyId: comapnyId ? comapnyId : undefined,
          title: req.query.title ? String(req.query.title) : undefined,
        },
      });

      res.status(200).json({
        success: true,
        message: "Retrieved all posts",
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  public async cursor(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const comapnyId = Number(req.query.comapnyId);
      const posts = await prisma.post.findMany({
        cursor: {
          id: Number(req.params.id),
        },
        include: {
          company: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        where: {
          companyId: comapnyId ? comapnyId : undefined,
          title: req.query.title ? String(req.query.title) : undefined,
        },
        skip: 1,
      });
      res.status(200).json({
        success: true,
        message: "Retrieved all posts",
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const post = await prisma.post.delete({
        where: {
          id: Number(req.params.id),
          companyId: req.cookies.id,
        },
      });
      deleteFileOnDisk(post.image, "images");
      res.status(200).json({ success: true, message: "post deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async editData(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const { title, content, internshipId } = req.query;

      await prisma.post.findUniqueOrThrow({
        where: { id: Number(req.params.id), companyId: req.cookies.id },
      });

      await prisma.post.update({
        where: { id: Number(req.params.id) },
        data: {
          title: title ? String(title) : undefined,
          content: content ? String(content) : undefined,
          internshipId: internshipId ? Number(internshipId) : undefined,
        },
      });

      res.status(200).json({ success: true, message: "Post updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  public async editImage(req: Request, res: Response<ResponseJSON>, next: NextFunction) {
    try {
      const existingPost = await prisma.post.findUniqueOrThrow({
        where: { id: Number(req.params.id), companyId: req.cookies.id },
      });

      notFound(req.file, "image");

      let image = existingPost.image;

      await deleteFileOnDisk(image, "images");

      image = req.file.filename;

      await prisma.post.update({
        where: { id: Number(req.params.id) },
        data: { image },
      });

      await saveFileToDisk(req.file, "images");
      res.status(200).json({ success: true, message: "Post image updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}
