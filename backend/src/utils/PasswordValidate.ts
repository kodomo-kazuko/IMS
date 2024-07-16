import bcrypt from "bcrypt";
import { Response } from "express";

export async function validatePassword(
  inputPassword: string,
  currentPassword: string,
  res: Response
) {
  const isPasswordValid = await bcrypt.compare(inputPassword, currentPassword);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }
  return true;
}
