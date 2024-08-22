import type { ApplicationStatus } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

export interface ResponseJSON {
	success: boolean;
	message: string;
	lastId?: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data?: any;
}

export interface Props {
	req: Request;
	res: Response<ResponseJSON>;
	next: NextFunction;
}

export interface ApplicationDTO {
	studentId: string;
	internshipId: string;
	status: ApplicationStatus;
}

export type ReturnType = {
	lastId: number;
	list: [];
};
