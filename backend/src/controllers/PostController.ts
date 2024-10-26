import type { NextFunction, Request, Response } from "express";
import { prisma } from "../middleware/PrismMiddleware";
import type { ResponseJSON } from "../types/response";
import { deleteFileOnDisk, saveFileToDisk } from "../utils/fileHandler";
import notFound from "../utils/not-found";
import { validateInput } from "../utils/validateInput";

export default class PostController {
	public async create(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			notFound(req.file, "file");
			const { title, content, internshipId } = req.body;

			validateInput({ title, content, internshipId }, res);

			await prisma.internship.findUniqueOrThrow({
				where: {
					id: Number(internshipId),
					companyId: req.cookies.id,
				},
			});

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

			res
				.status(201)
				.json({ success: true, message: "Post created successfully" });
		} catch (error) {
			next(error);
		}
	}

	public async single(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
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
			res
				.status(200)
				.json({ success: true, message: "post retrieved", data: post });
		} catch (error) {
			next(error);
		}
	}

	public async base(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const companyId = Number(req.query.comapnyId);
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
					companyId: companyId ? companyId : undefined,
					title: {
						search: req.query.title ? String(req.query.title) : undefined,
					},
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

	public async cursor(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const companyId = Number(req.query.comapnyId);
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
					companyId: companyId ? companyId : undefined,
					title: {
						search: req.query.title ? String(req.query.title) : undefined,
					},
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

	public async delete(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const post = await prisma.post.delete({
				where: {
					id: Number(req.params.id),
					companyId: req.cookies.id,
				},
			});
			deleteFileOnDisk(post.image, "images");
			res
				.status(200)
				.json({ success: true, message: "post deleted successfully" });
		} catch (error) {
			next(error);
		}
	}

	public async editData(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
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

			res
				.status(200)
				.json({ success: true, message: "Post updated successfully" });
		} catch (error) {
			next(error);
		}
	}

	public async editImage(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			notFound(req.file, "file");
			const existingPost = await prisma.post.findUniqueOrThrow({
				where: { id: Number(req.params.id), companyId: req.cookies.id },
			});

			let image = existingPost.image;

			await deleteFileOnDisk(image, "images");

			image = req.file.filename;

			await prisma.post.update({
				where: { id: Number(req.params.id) },
				data: { image },
			});

			await saveFileToDisk(req.file, "images");
			res
				.status(200)
				.json({ success: true, message: "Post image updated successfully" });
		} catch (error) {
			next(error);
		}
	}
}
