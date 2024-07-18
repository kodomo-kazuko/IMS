import {
  fakeMajorComplete,
  prisma,
  fakeStudent,
  fakeCompany,
  fakeInternshipComplete,
} from "./fake-data";

import bcrypt from "bcrypt";

export async function password() {
  const password = String(process.env.PASSWORD);
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function createStudents(amount: number) {
  const majorData = fakeMajorComplete();
  await prisma.major.create({
    data: {
      ...majorData,
    },
  });

  for (let i = 0; i < amount; i++) {
    const studentData = await fakeStudent();
    await prisma.student.create({
      data: studentData,
    });
  }
}

export async function createCompanies(amount: number) {
  for (let i = 0; i < amount; i++) {
    const data = await fakeCompany();
    await prisma.company.create({
      data: data,
    });
  }
}

export async function createInternships(amount: number) {
  for (let i = 0; i < amount; i++) {
    const data = fakeInternshipComplete();
    await prisma.internship.create({
      data: data,
    });
  }
}
