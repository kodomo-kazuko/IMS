import { PrismaClient } from "@prisma/client";
import updateURL from "../utils/urlUpdate";
import notFound from "../utils/not-found";
import { OrderFilter } from "../utils/orderFilter";
import getLastId from "../utils/lastId";

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
        args = { ...args, take: 50 };
        args = OrderFilter(args);
        const data = await query(args);
        notFound(data, model);
        const updatedData = updateURL(data as any, ["image", "document"]);
        const lastId = getLastId(updatedData);
        return { lastId, list: updatedData };
      },
      async findUnique({ model, operation, args, query }) {
        const data = await query(args);
        notFound(data, model);
        const dataArray = Array.isArray(data) ? data : [data];
        const updatedData = updateURL(dataArray as any, ["image", "document"]);
        return updatedData;
      },
    },
  },
});
