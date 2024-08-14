import { type AccountType, Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../middleware/PrismMiddleware";
import type { Props, ResponseJSON } from "../types/response";
import { jwtSecretKey } from "../utils/const";

const IP = process.env.IP;
const PORT = process.env.PORT;
const FILEPATH = process.env.FILE_PATH;
const FILETYPE = "images";

export default class RootController {
	public async tokenRenew(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	): Promise<void> {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) {
			res.status(401).json({ success: false, message: "No token provided" });
			return;
		}
		try {
			const decoded = jwt.verify(token, jwtSecretKey) as jwt.JwtPayload;
			if (!decoded.iat) {
				throw new Error("Invalid token");
			}
			const issuedAt = new Date(decoded.iat * 1000);
			const threeAndHalfDaysAgo = new Date(
				Date.now() - 3.5 * 24 * 60 * 60 * 1000,
			);
			if (issuedAt < threeAndHalfDaysAgo) {
				const newToken = jwt.sign({ id: decoded.id }, jwtSecretKey, {
					expiresIn: "7d",
				});
				res.status(200).json({
					success: true,
					message: "Token renewed",
					data: { token: newToken },
				});
			} else {
				res.status(200).json({ success: true, message: "User is signed in" });
			}
		} catch (error) {
			next(error);
		}
	}

	public async check(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			res.status(200).json({ success: true, message: "Backend is running" });
		} catch (error) {
			next(error);
		}
	}
	public async test({ req, res, next }: Props) {
		try {
			res.status(200).json({ success: true, message: "it worked" });
		} catch (error) {
			next(error);
		}
	}
	public async account(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const accountType: AccountType = req.cookies.account;
			const id = req.cookies.id;
			const query = `SELECT * FROM "${accountType}" WHERE id = ${id}`;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const result: Array<any> = await prisma.$queryRawUnsafe(query);

			if (result.length > 0) {
				result[0].password = undefined;
				const image = result[0].image;
				result[0].image = `http://${IP}:${PORT}/${FILEPATH}/${FILETYPE}/${image}`;
			}

			res.json({
				success: true,
				message: "account data retrieved",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}
}
