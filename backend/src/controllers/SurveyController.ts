import { AccountType } from "@prisma/client";
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
					OR: [
						{
							visible:
								req.cookies.account === AccountType.Employee ? undefined : true,
						},
					],
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
					OR: [
						{
							visible:
								req.cookies.account === AccountType.Employee ? undefined : true,
						},
					],
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
			const { title, questions } = req.body;

			validateInput({ title }, res);
			const survey = await prisma.survey.create({
				data: {
					title,
					creatorId: req.cookies.id,
				},
			});

			if (questions && Array.isArray(questions)) {
				const questionData = questions.map((req) => ({
					surveyId: survey.id,
					question: String(req.question),
					order: Number(req.order),
				}));
				await prisma.question.createMany({
					data: questionData,
				});
			}
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
					OR: [
						{
							visible:
								req.cookies.account === AccountType.Employee ? undefined : true,
						},
					],
				},
				include: {
					questions: {
						orderBy: {
							order: "asc",
						},
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
}
