import type { NextFunction, Request, Response } from "express";
import { prisma } from "../middleware/PrismMiddleware";
import type { ResponseJSON } from "../types/response";
import { validateInput } from "../utils/validateInput";

export default class SurveyController {
	public async base(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { title } = req.query;
			const survey = await prisma.survey.findMany({
				where: {
					title: {
						search: title ? String(title) : undefined,
					},
				},
			});
			res
				.status(200)
				.json({ success: true, message: "survey retrieved", data: survey });
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
			const { title } = req.query;
			const survey = await prisma.survey.findMany({
				where: {
					title: {
						search: title ? String(title) : undefined,
					},
				},
				skip: 1,
				cursor: {
					id: Number(req.params.id),
				},
			});
			res
				.status(200)
				.json({ success: true, message: "survey retrieved", data: survey });
		} catch (error) {
			next(error);
		}
	}
	public async create(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { title } = req.body;
			validateInput({ title }, res);
			await prisma.survey.create({
				data: {
					title,
					creatorId: req.cookies.id,
				},
			});
			res
				.status(201)
				.json({ success: true, message: "survey created successfully" });
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
			const { id } = req.params;
			const survey = await prisma.survey.findUniqueOrThrow({
				where: {
					id: Number(id),
				},
			});
			res
				.status(200)
				.json({ success: true, message: "survey retrieved", data: survey });
		} catch (error) {
			next(error);
		}
	}
}
