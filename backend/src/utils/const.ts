import { PrismaClient } from "@prisma/client";
import { Secret } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}
export const prisma = new PrismaClient({
  omit: {
    company: {
      password: true,
    },
    student: {
      password: true,
    },
    employee: {
      password: true,
    },
    mentor: {
      password: true,
    },
  },
});

export const jwtSecretKey: Secret = jwtSecret;

export const limit: number = 50;

export const limitSize: number = 5000000;

export const companyAccess = 0;
