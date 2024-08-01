import type { NextFunction, Request, Response } from "express";
import { prisma } from "../middleware/PrismMiddleware";
import type { ResponseJSON } from "../types/response";
import { validateInput } from "../utils/validateInput";

export default class RoleController {
	public async create(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { name } = req.body;
			validateInput({ name }, res);
			await prisma.role.create({
				data: {
					name,
				},
			});
			res.status(201).json({
				success: true,
				message: "Role created successfully",
			});
		} catch (error) {
			next(error);
		}
	}
	public async all(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const roles = await prisma.role.findMany();
			res.status(200).json({
				success: true,
				message: "stuff",
				data: roles,
			});
		} catch (error) {
			next(error);
		}
	}
	public async edit(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { id, name } = req.body;
			validateInput({ name, id }, res);
			await prisma.role.update({
				where: {
					id: Number(id),
				},
				data: {
					name,
				},
			});
			res.status(200).json({ success: true, message: "role name updated" });
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
			await prisma.role.delete({
				where: {
					id: Number(req.params.id),
				},
			});
			res
				.status(200)
				.json({ success: true, message: "role deleted successfully" });
		} catch (error) {
			next(error);
		}
	}
}
