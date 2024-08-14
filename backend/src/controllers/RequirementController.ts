import type { NextFunction, Request, Response } from "express";
import { prisma } from "../middleware/PrismMiddleware";
import type { ResponseJSON } from "../types/response";
import notFound from "../utils/not-found";
import { validateInput } from "../utils/validateInput";

interface RequirementTypes {
	majorId: number;
	internshipId: number;
	studentLimit: number;
}

export default class RequirementController {
	public async createMany(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { requirements }: { requirements: RequirementTypes[] } = req.body;

			// Validate input using a for loop
			for (let i = 0; i < requirements.length; i++) {
				const { majorId, internshipId, studentLimit } = requirements[i];
				validateInput(
					{
						majorId: Number(majorId),
						internshipId: Number(internshipId),
						studentLimit: Number(studentLimit),
					},
					res,
				);
			}

			// Check if internship exists and belongs to the company
			await prisma.internship.findUniqueOrThrow({
				where: {
					id: Number(requirements[0].internshipId),
					companyId: req.cookies.id,
				},
			});

			// Prepare data for creating multiple requirements
			const requirementData = requirements.map(
				({ majorId, internshipId, studentLimit }) => ({
					internshipId: Number(internshipId),
					majorId: Number(majorId),
					studentLimit: Number(studentLimit),
				}),
			);

			// Create multiple requirements
			await prisma.requirement.createMany({
				data: requirementData,
			});

			// Send success response
			return res.status(200).json({
				success: true,
				message: "Internship requirements created successfully",
			});
		} catch (error) {
			next(error);
		}
	}

	public async internship(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const internshipId = Number(req.params.id);
			const requirements = await prisma.internship
				.findUniqueOrThrow({
					where: {
						id: internshipId,
					},
				})
				.requirements({
					include: {
						_count: {
							select: {
								Application: {
									where: {
										status: "started",
									},
								},
							},
						},
					},
				});
			notFound(requirements, "requirements");
			res.status(200).json({
				success: true,
				message: "requirements retrieved",
				data: requirements,
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
			await prisma.requirement.delete({
				where: {
					id: Number(req.params.id),
					internship: {
						companyId: req.cookies.id,
					},
				},
			});
			res.status(200).json({ success: true, message: "requirement deleted" });
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
			const { studentLimit, majorId } = req.query;

			validateInput({ studentLimit, majorId }, res);

			const updatedRequirement = await prisma.requirement.updateMany({
				where: {
					id: Number(req.params.id),
					internship: {
						companyId: req.cookies.id,
					},
				},
				data: {
					studentLimit: studentLimit ? Number(studentLimit) : undefined,
					majorId: majorId ? Number(majorId) : undefined,
				},
			});

			if (updatedRequirement.count === 0) {
				return res
					.status(404)
					.json({ success: false, message: "Requirement not found" });
			}

			res.status(200).json({ success: true, message: "Requirement updated" });
		} catch (error) {
			next(error);
		}
	}
}
