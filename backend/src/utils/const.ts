import { Secret } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

export const jwtSecretKey: Secret = jwtSecret;

export const limitSize: number = 5000000;
