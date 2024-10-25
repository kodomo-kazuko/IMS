import { InternshipStatus } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "../middleware/PrismMiddleware";
import type { ResponseJSON } from "../types/response";
import { validateInput } from "../utils/validateInput";
export default class StudentInternshipController {
	public async types(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const internshipStatus = Object.values(InternshipStatus);
			res.status(200).json({
				success: true,
				message: "retrieved internship status types",
				data: internshipStatus,
			});
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
			const studentId = req.cookies.id;
			const internshipId = Number(req.params.id);

			if (Number.isNaN(internshipId)) {
				return res.status(400).json({
					success: false,
					message: "Invalid internship ID.",
				});
			}

			// Check if the student already has an active internship
			const startedInternship = await prisma.studentInternship.findFirst({
				where: {
					studentId,
					internshipId,
				},
			});

			if (startedInternship) {
				return res.status(409).json({
					success: false,
					message: "You already have an active internship.",
				});
			}

			// Find the application
			const application = await prisma.application.findUniqueOrThrow({
				where: {
					id: internshipId,
					studentId,
				},
				include: {
					requirement: true,
				},
			});

			if (application.status !== "approved") {
				return res.status(400).json({
					success: false,
					message: "Application is not approved.",
				});
			}

			const requirement = application.requirement;

			const startedCount = await prisma.application.count({
				where: {
					status: "started",
					requirementId: application.requirementId,
				},
			});

			if (requirement.studentLimit <= startedCount) {
				return res.status(409).json({
					success: false,
					message: "Student limit reached.",
				});
			}

			// Start a transaction
			const result = await prisma.$transaction(async (prisma) => {
				// Create the student internship
				const newInternship = await prisma.studentInternship.create({
					data: {
						studentId,
						internshipId: application.internshipId,
					},
				});

				// Update the current application status to "started"
				await prisma.application.update({
					where: {
						id: application.id,
					},
					data: {
						status: "started",
					},
				});

				// Optionally, cancel other pending or approved applications if necessary
				await prisma.application.updateMany({
					where: {
						studentId,
						status: {
							in: ["approved", "pending"],
						},
						NOT: {
							id: application.id,
						},
					},
					data: {
						status: "cancelled",
					},
				});

				return newInternship;
			});

			res.status(200).json({
				success: true,
				message: "Internship pending a mentor",
			});
		} catch (error) {
			next(error);
		}
	}

	public async start(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { id, mentorId } = req.body;
			validateInput({ id, mentorId }, res);
			const studentinertnship =
				await prisma.studentInternship.findUniqueOrThrow({
					where: {
						id: Number(id),
					},
				});
			const mentor = await prisma.mentor.findUniqueOrThrow({
				where: {
					id: Number(mentorId),
				},
			});
			if (mentor.companyId !== req.cookies.id) {
				res.status(400).json({
					success: false,
					message: "mentor does not belong to this company",
				});
			}
			await prisma.studentInternship.update({
				where: {
					studentId_internshipId: {
						studentId: studentinertnship.studentId,
						internshipId: studentinertnship.internshipId,
					},
				},
				data: {
					mentorId: mentor.id,
					status: "ready",
				},
			});
			res.status(200).json({ success: true, message: "internship started!" });
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
			const { studentId, internshipId } = req.query;
			const studentInternship = await prisma.studentInternship.findMany({
				where: {
					studentId: studentId ? Number(studentId) : undefined,
					internshipId: internshipId ? Number(internshipId) : undefined,
				},
			});
			res.status(200).json({
				success: true,
				message: "student internships retirved",
				data: studentInternship,
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
			const { studentId, internshipId } = req.query;
			const studentInternship = await prisma.studentInternship.findMany({
				where: {
					studentId: studentId ? Number(studentId) : undefined,
					internshipId: internshipId ? Number(internshipId) : undefined,
				},
				cursor: {
					id: Number(req.params.id),
				},
				skip: 1,
			});
			res.status(200).json({
				success: true,
				message: "student internships retirved",
				data: studentInternship,
			});
		} catch (error) {
			next(error);
		}
	}
}
