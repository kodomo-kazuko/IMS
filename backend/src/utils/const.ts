export const limit: number = 100;

export const limitSize: number = 5000000;

import { PrismaClient } from "@prisma/client";

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
