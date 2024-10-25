import type { AccountType } from "@prisma/client";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../middleware/PrismMiddleware";
import type { ResponseJSON } from "../types/response";
import { validatePassword } from "../utils/PasswordValidate";
import { jwtSecretKey } from "../utils/const";
import { deleteFileOnDisk, saveFileToDisk } from "../utils/fileHandler";
import notFound from "../utils/not-found";
import { validateInput } from "../utils/validateInput";

const account: AccountType = "Student";

export default class StudentController {
	public async signup(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { name, email, password, majorId, phone, address } = req.body;
			validateInput({ name, email, password, majorId, phone, address }, res);
			const hashedPassword = await bcrypt.hash(password, 10);
			await prisma.student.create({
				data: {
					name,
					email,
					password: hashedPassword,
					majorId,
					phone,
					address,
				},
			});
			res
				.status(201)
				.json({ success: true, message: "New student created successfully" });
		} catch (error) {
			next(error);
		}
	}

	public async signin(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { email, password } = req.body;
			validateInput({ email, password }, res);
			const student = await prisma.student.findUniqueOrThrow({
				where: { email },
				omit: {
					password: false,
				},
			});

			await validatePassword(password, student.password, res);

			const token = jwt.sign(
				{ id: student.id, account, access: student.majorId },
				jwtSecretKey,
				{
					expiresIn: "7d",
				},
			);
			res.status(200).json({
				success: true,
				message: "Authentication successful",
				data: token,
			});
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
			const students = await prisma.student.findMany({
				omit: {
					majorId: true,
				},
				include: {
					major: true,
				},
				where: {
					name: {
						search: req.query.name ? String(req.query.name) : undefined,
					},
				},
			});
			res.status(200).json({
				success: true,
				message: "Students retrieved successfully",
				data: students,
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
			const students = await prisma.student.findMany({
				skip: 1,
				omit: {
					majorId: true,
				},
				include: {
					major: true,
				},
				cursor: {
					id: Number(req.params.id),
				},
				where: {
					name: {
						search: req.query.name ? String(req.query.name) : undefined,
					},
				},
			});
			res.status(200).json({
				success: true,
				message: "Students retrieved successfully",
				data: students,
			});
		} catch (error) {
			next(error);
		}
	}
	public async createDocument(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const student = await prisma.student.findUniqueOrThrow({
				where: {
					id: req.cookies.id,
				},
			});

			student.document
				? res
						.status(400)
						.json({ success: false, message: "you already have a document" })
				: undefined;
			notFound(req.file, "file");
			await prisma.student.update({
				where: { id: req.cookies.id },
				data: {
					document: req.file.filename,
				},
			});
			await saveFileToDisk(req.file, "documents");
			res
				.status(201)
				.json({ success: true, message: "document uploaded successfully" });
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
			const student = await prisma.student.findUnique({
				where: {
					id: Number(req.params.id),
				},
			});
			res
				.status(200)
				.json({ success: true, message: "retrieved student", data: student });
		} catch (error) {
			next(error);
		}
	}
	public async account(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const student = await prisma.student.findUnique({
				omit: {
					majorId: true,
				},
				include: {
					major: {
						select: {
							id: true,
							name: true,
						},
					},
				},
				where: {
					id: req.cookies.id,
				},
			});

			res
				.status(200)
				.json({ success: true, message: "retrieved student", data: student });
		} catch (error) {
			next(error);
		}
	}
	public async uploadImage(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			notFound(req.file, "file");
			await prisma.student.findUniqueOrThrow({
				where: {
					id: req.cookies.id,
					image: null,
				},
			});

			await prisma.student.update({
				where: { id: req.cookies.id },
				data: {
					image: req.file.filename,
				},
			});
			await saveFileToDisk(req.file, "images");
			res
				.status(201)
				.json({ success: true, message: "Image uploaded successfully" });
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
			const student = await prisma.student.delete({
				where: {
					id: Number(req.params.id),
				},
			});
			student.image ? deleteFileOnDisk(student.image, "images") : undefined;
			student.document
				? deleteFileOnDisk(student.document, "documents")
				: undefined;
		} catch (error) {
			next(error);
		}
	}
	public async count(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const studentCount = await prisma.student.count();
			return res.status(200).json({
				success: true,
				message: "student count retrieved",
				data: studentCount,
			});
		} catch (error) {}
	}
}
