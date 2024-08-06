import type { AccountType } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { ResponseJSON } from "../types/response";
import { jwtSecretKey } from "../utils/const";

interface DecodedToken {
	account: AccountType;
	id: number;
	iat: number;
	exp: number;
	access: number;
}

interface AccessRequirement {
	account: AccountType;
	access?: number;
}

export default function accessMiddleware(
	requiredAccess: AccessRequirement[] | "all",
) {
	if (
		requiredAccess !== "all" &&
		(!Array.isArray(requiredAccess) || requiredAccess.length === 0)
	) {
		throw new Error(
			"requiredAccess must be 'all' or a non-empty array of objects with valid account types and access levels",
		);
	}

	return async (
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) => {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				return res.status(401).json({
					success: false,
					message: "No token found",
				});
			}

			const decoded: DecodedToken = jwt.verify(
				token,
				jwtSecretKey,
			) as DecodedToken;

			if (requiredAccess !== "all") {
				const matchedRequirement = requiredAccess.find(
					(req) =>
						req.account === decoded.account &&
						(req.access === null ||
							req.access === undefined ||
							(decoded.access ?? 100) <= req.access),
				);

				if (!matchedRequirement) {
					return res.status(403).json({
						success: false,
						message: "Access denied",
					});
				}
			}

			req.cookies = decoded;
			next();
		} catch (error) {
			next(error);
		}
	};
}
