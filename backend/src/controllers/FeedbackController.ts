import { AccountType } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../middleware/PrismMiddleware";
import type { ResponseJSON } from "../types/response";
import notFound from "../utils/not-found";

export default class FeedbackController {
	public async create(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { content, score, internshipId } = req.body;
			const internship = await prisma.studentInternship.findFirstOrThrow({
				where: {
					studentId:
						req.cookies.account === AccountType.Student
							? req.cookies.id
							: undefined,
					internshipId: Number(internshipId),
					internship: {
						companyId:
							req.cookies.account === AccountType.Company
								? req.cookies.id
								: undefined,
					},
				},
			});

			notFound(internship, "internship");

			await prisma.feedback.create({
				data: {
					userId: req.cookies.id,
					content: String(content),
					score: Math.max(-1, Math.min(10, Number(score))),
					internshipId: Number(internshipId),
					account: req.cookies.account,
				},
			});
			res.status(200).json({ success: true, message: "feedback submitted" });
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
			const feedback = await prisma.feedback.findMany({
				where: {
					studentinternship: {
						internship: {
							companyId: req.query.companyId
								? Number(req.query.companyId)
								: undefined,
						},
					},
				},
			});
			res.status(200).json({
				success: true,
				message: "Feedback retrieved successfully",
				data: feedback,
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
			const feedback = await prisma.feedback.findMany({
				skip: 1,
				cursor: {
					id: Number(req.params.id),
				},
				where: {
					studentinternship: {
						internship: {
							companyId: req.query.companyId
								? Number(req.query.companyId)
								: undefined,
						},
					},
				},
			});
			res
				.status(200)
				.json({ success: true, message: "feedback retrieved", data: feedback });
		} catch (error) {
			next(error);
		}
	}
	public async score(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const account = req.params.account;

			const averageFeedbackScores = await prisma.$queryRaw`
				SELECT 
					c.id AS companyId, 
					c.name AS companyName, 
					AVG(f.score) AS averageScore
				FROM 
					${account} c
				JOIN 
					"Feedback" f 
				ON 
					c.id = f."userId"
				WHERE 
					f.account = ${account === "Company" ? "Student" : "Company"}
				GROUP BY 
					c.id, c.name
				ORDER BY 
					averageScore DESC;
			`;

			res.status(200).json({
				success: true,
				message: `${account} scores retrieved`,
				data: averageFeedbackScores,
			});
		} catch (error) {
			next(error);
		}
	}
}
