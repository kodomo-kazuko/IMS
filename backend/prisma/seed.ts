import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const seedDatabase = async () => {
  try {
    const { ROLE_NAME, PASSWORD, NAME, EMAIL, PHONE } = process.env;

    if (!PASSWORD || !NAME || !EMAIL || !PHONE || !ROLE_NAME) {
      throw new Error("One or more environment variables are missing.");
    }

    await prisma.role.create({
      data: {
        id: 0,
        name: ROLE_NAME,
      },
    });

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
