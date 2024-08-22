import type { NextFunction, Request, Response } from "express";
import { prisma } from "../types/fake-data";
import type { ResponseJSON } from "../types/response";
import { validateInput } from "../utils/validateInput";

export default class QuestionController {
	public async createMany(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { questions, surveyId } = req.body;

			validateInput({ questions, surveyId }, res);

			if (!Array.isArray(questions) || !questions.length) {
				return res.status(400).json({
					success: false,
					message: "Invalid input: questions must be a non-empty array",
				});
			}

			const survey = await prisma.survey.findUniqueOrThrow({
				where: {
					id: surveyId,
				},
			});

			const questionData = questions.map(
				(question: { question: string; order: number; surveyId: number }) => ({
					question: question.question,
					order: question.order,
					surveyId: survey.id,
				}),
			);

			await prisma.question.createMany({
				data: questionData,
			});

			res.status(200).json({ success: true, message: "questions created" });
		} catch (error) {
			next(error);
		}
	}
}
