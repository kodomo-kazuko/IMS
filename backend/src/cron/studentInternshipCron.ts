import { InternshipStatus } from "@prisma/client";
import { subDays } from "date-fns";
import logger from "../logs/logger";
import { prisma } from "../middleware/PrismMiddleware";

// Function to update status to ACTIVE if today is between startDate and endDate
export async function updateInternshipStatusToActive() {
	logger.info(
		"Running cron job to update student internship statuses to ACTIVE",
	);

	const today = new Date();

	try {
		await prisma.$transaction(async (prisma) => {
			const updatedInternships = await prisma.studentInternship.updateMany({
				where: {
					status: InternshipStatus.ready,
					internship: {
						startDate: {
							lte: today,
						},
						endDate: {
							gte: today,
						},
					},
				},
				data: {
					status: InternshipStatus.started,
				},
			});

			logger.info(`Updated ${updatedInternships.count} internships to ACTIVE`);

			if (updatedInternships.count === 0) {
				logger.warn(
					"No internships were updated to ACTIVE. There might be no internships with today's date within the start and end dates.",
				);
			}
		});
	} catch (error) {
		logger.error(
			"Error updating student internship statuses to ACTIVE:",
			error,
		);
	}
}

// Function to update status to FINISHED if today is the endDate
export async function updateInternshipStatusToFinished() {
	logger.info(
		"Running cron job to update student internship statuses to FINISHED",
	);

	const today = new Date();
	const yesterday = subDays(today, 1);

	try {
		await prisma.$transaction(async (prisma) => {
			const updatedInternships = await prisma.studentInternship.updateMany({
				where: {
					status: InternshipStatus.started,
					internship: {
						endDate: {
							gte: yesterday,
							lt: today,
						},
					},
				},
				data: {
					status: InternshipStatus.finished,
				},
			});

			logger.info(
				`Updated ${updatedInternships.count} internships to FINISHED`,
			);

			if (updatedInternships.count === 0) {
				logger.warn(
					"No internships were updated to FINISHED. There might be no active internships with yesterday's end date.",
				);
			}
		});
	} catch (error) {
		logger.error(
			"Error updating student internship statuses to FINISHED:",
			error,
		);
	}
}
