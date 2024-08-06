import type { Response } from "express";
import type { ResponseJSON } from "../types/response";

export const validateInput = (
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	fields: Record<string, any>,
	res: Response<ResponseJSON>,
) => {
	const missingFields: string[] = [];

	for (const [key, value] of Object.entries(fields)) {
		if (value === undefined || value === null || value === "") {
			missingFields.push(key);
		}
	}

	if (missingFields.length > 0) {
		return res.status(400).json({
			success: false,
			message: `Missing required fields: ${missingFields.join(", ")}`,
		});
	}
};
