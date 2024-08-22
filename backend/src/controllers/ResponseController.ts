import type { NextFunction, Request, Response } from "express";
import { prisma } from "../middleware/PrismMiddleware";
import type { ResponseJSON } from "../types/response";
import { validateInput } from "../utils/validateInput";

export default class ResponseController {
	public async createSurveyResponse(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { answers, surveyId } = req.body;

			validateInput({ answers, surveyId }, res);

			await prisma.$transaction(async (prisma) => {
				const response = await prisma.response.create({
					data: {
						surveyId: Number(surveyId),
						userId: req.cookies.id,
						account: req.cookies.account,
					},
				});

				if (Array.isArray(answers) && answers.length !== 0) {
					const answersData = answers.map((req) => ({
						questionId: req.questionId,
						responseId: response.id,
						rating: req.rating,
					}));

					await prisma.answer.createMany({
						data: answersData,
					});
				}
			});
			res.status(200).json({ success: true, message: "survey answered" })
		} catch (error) {
			next(error);
		}
	}
}
