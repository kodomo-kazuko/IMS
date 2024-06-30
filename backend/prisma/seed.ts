import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const seedDatabase = async () => {
  try {
    const { roleName, PASSWORD, NAME, EMAIL, PHONE } = process.env;

    if (!roleName) {
      throw new Error("Environment variable ROLE_NAME is missing.");
    }

    await prisma.role.create({
      data: {
        id: 0,
        name: roleName,
      },
    });

    if (!PASSWORD || !NAME || !EMAIL || !PHONE) {
      throw new Error("One or more environment variables are missing.");
    }

    const hashedPassword = await bcrypt.hash(PASSWORD, 10);

    await prisma.employee.create({
      data: {
        name: NAME,
        email: EMAIL,
        password: hashedPassword,
        roleId: 0,
        phone: PHONE,
      },
    });
  } catch (error) {
    console.error("Error during seeding:", (error as Error).message);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
