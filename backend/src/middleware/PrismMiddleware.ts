import { PrismaClient } from "@prisma/client";
import updateURL from "../utils/urlUpdate";
import notFound from "../utils/not-found";

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
}).$extends({
  query: {
    $allModels: {
      async findMany({ model, operation, args, query }) {
        args = { ...args, take: 20, orderBy: { updatedAt: "desc" } };
        const data = await query(args);
        const updatedData = updateURL(data as any, ["image", "document"]);
        notFound(updatedData, "data");
        return updatedData;
      },
      async findUnique({ model, operation, args, query }) {
        const data = await query(args);
        const dataArray = Array.isArray(data) ? data : [data];
        const updatedData = updateURL(dataArray, ["image", "document"]);
        notFound(updatedData, "data");
        return updatedData;
      },
    },
  },
});
