import type { NextFunction, Request, Response } from "express";
import type { ResponseJSON } from "../types/response";

export default class QuestionController {
	public async createMany(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { question, order } = req.body;
		} catch (error) {
			next(error);
		}
	}
}
