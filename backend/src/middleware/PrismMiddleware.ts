import { PrismaClient } from "@prisma/client";
import { updateURL } from "../utils/urlUpdate";

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
      findMany({ model, operation, args, query }) {
        args = { ...args, take: 20, orderBy: { createdAt: "desc" } };

        return query(args);
      },
    },

    student: {
      async findMany({ model, operation, args, query }) {
        const data = await query(args);
        const dataArray = Array.isArray(data) ? data : [data];
        const updatedData = updateURL(dataArray, ["image", "document"]);

        return updatedData;
      },
      async findUnique({ model, operation, args, query }) {
        const data = await query(args);
        const dataArray = Array.isArray(data) ? data : [data];
        const updatedData = updateURL(dataArray, ["image", "document"]);

        return updatedData;
      },
    },
    post: {
      async findMany({ model, operation, args, query }) {
        const data = await query(args);
        const dataArray = Array.isArray(data) ? data : [data];
        const updatedData = updateURL(dataArray, ["image"]);

        return updatedData;
      },
      async findUnique({ model, operation, args, query }) {
        const data = await query(args);
        const dataArray = Array.isArray(data) ? data : [data];
        const updatedData = updateURL(dataArray, ["image"]);

        return updatedData;
      },
    },
    company: {
      async findMany({ model, operation, args, query }) {
        const data = await query(args);
        const dataArray = Array.isArray(data) ? data : [data];
        const updatedData = updateURL(dataArray, ["image"]);

        return updatedData;
      },
    },
    employee: {
      async findMany({ model, operation, args, query }) {
        const data = await query(args);
        const dataArray = Array.isArray(data) ? data : [data];
        const updatedData = updateURL(dataArray, ["image"]);

        return updatedData;
      },
      async findUnique({ model, operation, args, query }) {
        const data = await query(args);
        const dataArray = Array.isArray(data) ? data : [data];
        const updatedData = updateURL(dataArray, ["image"]);

        return updatedData;
      },
    },
  },
});
