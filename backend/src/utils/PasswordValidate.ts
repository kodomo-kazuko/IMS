import bcrypt from "bcrypt";
import type { Response } from "express";
import type { ResponseJSON } from "../types/response";

export async function validatePassword(
	inputPassword: string,
	currentPassword: string,
	res: Response<ResponseJSON>,
) {
	const isPasswordValid = await bcrypt.compare(inputPassword, currentPassword);
	if (!isPasswordValid) {
		return res
			.status(401)
			.json({ success: false, message: "Invalid password" });
	}
	return true;
}
