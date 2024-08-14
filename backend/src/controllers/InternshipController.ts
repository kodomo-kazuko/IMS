import { InternshipType } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../middleware/PrismMiddleware";
import type { ResponseJSON } from "../types/response";
import { validateInput } from "../utils/validateInput";

export default class InternshipController {
	public async create(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const {
				title,
				type,
				enrollmentEndDate,
				startDate,
				endDate,
				salary,
				requirements,
			} = req.body;

			// Validate input
			validateInput(
				{ title, type, enrollmentEndDate, startDate, endDate, salary },
				res,
			);

			// Convert dates to ISO strings
			const enrollISO = new Date(enrollmentEndDate).toISOString();
			const startISO = new Date(startDate).toISOString();
			const endISO = new Date(endDate).toISOString();

			// Create internship entry
			const internship = await prisma.internship.create({
				data: {
					title,
					type,
					enrollmentEndDate: enrollISO,
					startDate: startISO,
					endDate: endISO,
					companyId: req.cookies.id,
					salary,
				},
			});

			// Check if requirements are provided
			if (requirements && Array.isArray(requirements)) {
				const requirementData = requirements.map((req) => ({
					internshipId: internship.id,
					majorId: Number(req.majorId),
					studentLimit: Number(req.studentLimit),
				}));

				// Create multiple requirements
				await prisma.requirement.createMany({
					data: requirementData,
				});
			}

			// Send success response
			res
				.status(201)
				.json({ success: true, message: "Internship created successfully" });
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
			const companyId = Number(req.query.companyId);
			const internships = await prisma.internship.findMany({
				where: {
					companyId: companyId ? companyId : undefined,
					title: req.query.title ? String(req.query.title) : undefined,
				},
				omit: {
					companyId: true,
				},
				include: {
					company: {
						select: {
							name: true,
							image: true,
							id: true,
						},
					},
					requirements: {
						select: {
							id: true,
							studentLimit: true,
						},
					},
				},
			});
			res.status(200).json({
				success: true,
				message: "Internships retrieved successfully",
				data: internships,
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
			const companyId = Number(req.query.companyId);
			const internships = await prisma.internship.findMany({
				skip: 1,
				cursor: {
					id: Number(req.params.id),
				},
				where: {
					companyId: companyId ? companyId : undefined,
					title: req.query.title ? String(req.query.title) : undefined,
				},
				omit: {
					companyId: true,
				},
				include: {
					company: true,
				},
			});
			res.status(200).json({
				success: true,
				message: "Internships retrieved successfully",
				data: internships,
			});
		} catch (error) {
			next(error);
		}
	}
	public async types(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const internshipTypes = Object.values(InternshipType);
			res.status(200).json({
				success: true,
				message: "retrieved internship types",
				data: internshipTypes,
			});
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
			const internship = await prisma.internship.findUniqueOrThrow({
				where: {
					id: Number(req.params.id),
				},
			});
			res.status(200).json({
				success: true,
				message: "internship retrieved",
				data: internship,
			});
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
			const internshipCount = await prisma.internship.count();
			return res.status(200).json({
				success: true,
				message: "internship count retrieved",
				data: internshipCount,
			});
		} catch (error) {}
	}
	public async delete(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			await prisma.internship.delete({
				where: {
					id: Number(req.params.id),
					companyId: req.cookies.id,
				},
			});
			res.status(200).json({ success: true, message: "internship deleted" });
		} catch (error) {
			next(error);
		}
	}
}
