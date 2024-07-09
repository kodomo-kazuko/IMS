import { ApplicationStatus, InternshipType, InternshipStatus, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { prisma } from "../utils/const";

async function password() {
  const password = String(process.env.PASSWORD);
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function fakeStudent() {
  const hashedPassword = await password();
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword,
    phone: faker.lorem.words(5),
    address: faker.lorem.words(5),
    majorId: faker.number.int({ min: 1, max: 1 }),
  };
}
export function fakeStudentComplete() {
  return {
    id: faker.number.int(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.lorem.words(5),
    phone: faker.lorem.words(5),
    address: faker.lorem.words(5),
    image: undefined,
    document: undefined,
    majorId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export async function fakeCompany() {
  const hashedPassword = await password();
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword,
    phone: faker.lorem.words(5),
    weburl: faker.lorem.words(5),
    address: faker.lorem.words(5),
  };
}
export function fakeCompanyComplete() {
  return {
    id: faker.number.int(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.lorem.words(5),
    phone: faker.lorem.words(5),
    weburl: faker.lorem.words(5),
    address: faker.lorem.words(5),
    isApproved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeApplication() {
  return {
    type: faker.helpers.arrayElement([
      InternshipType.INTRODUCTION,
      InternshipType.PROFESSIONAL,
      InternshipType.VOLUNTEER,
      InternshipType.PART_TIME,
    ] as const),
  };
}
export function fakeApplicationComplete() {
  return {
    id: faker.number.int(),
    studentId: faker.number.int(),
    internshipId: faker.number.int(),
    type: faker.helpers.arrayElement([
      InternshipType.INTRODUCTION,
      InternshipType.PROFESSIONAL,
      InternshipType.VOLUNTEER,
      InternshipType.PART_TIME,
    ] as const),
    status: ApplicationStatus.PENDING,
    appliedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeMajor() {
  return {
    name: faker.person.fullName(),
  };
}
export function fakeMajorComplete() {
  return {
    id: faker.number.int({ min: 1, max: 1 }),
    name: faker.word.noun(1),
  };
}
export function fakeEmployee() {
  return {
    name: faker.person.fullName(),
    password: faker.lorem.words(5),
    image: undefined,
    email: faker.internet.email(),
    phone: faker.lorem.words(5),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeEmployeeComplete() {
  return {
    id: faker.number.int(),
    name: faker.person.fullName(),
    password: faker.lorem.words(5),
    image: undefined,
    email: faker.internet.email(),
    phone: faker.lorem.words(5),
    roleId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakePost() {
  return {
    title: faker.lorem.words(5),
    content: faker.lorem.words(5),
    image: faker.image.avatar(),
  };
}
export function fakePostComplete() {
  return {
    id: faker.number.int(),
    title: faker.lorem.words(5),
    content: faker.lorem.words(5),
    image: faker.image.avatar(),
    companyId: faker.number.int(),
    internshipId: faker.number.int(),
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeRole() {
  return {
    name: faker.person.fullName(),
  };
}
export function fakeRoleComplete() {
  return {
    id: faker.number.int(),
    name: faker.person.fullName(),
  };
}
export function fakeInternship() {
  return {
    title: faker.lorem.words(5),
    type: faker.helpers.arrayElement([
      InternshipType.INTRODUCTION,
      InternshipType.PROFESSIONAL,
      InternshipType.VOLUNTEER,
      InternshipType.PART_TIME,
    ] as const),
    enrollmentEndDate: faker.date.anytime(),
    startDate: faker.date.anytime(),
    endDate: faker.date.anytime(),
  };
}
export function fakeInternshipComplete() {
  return {
    id: faker.number.int(),
    title: faker.lorem.words(5),
    type: faker.helpers.arrayElement([
      InternshipType.INTRODUCTION,
      InternshipType.PROFESSIONAL,
      InternshipType.VOLUNTEER,
      InternshipType.PART_TIME,
    ] as const),
    companyId: faker.number.int(),
    createdAt: new Date(),
    enrollmentEndDate: faker.date.anytime(),
    startDate: faker.date.anytime(),
    endDate: faker.date.anytime(),
    updatedAt: new Date(),
  };
}
export function fakeStudentInternship() {
  return {
    type: faker.helpers.arrayElement([
      InternshipType.INTRODUCTION,
      InternshipType.PROFESSIONAL,
      InternshipType.VOLUNTEER,
      InternshipType.PART_TIME,
    ] as const),
    status: faker.helpers.arrayElement([
      InternshipStatus.PENDING,
      InternshipStatus.STARTED,
      InternshipStatus.FINISHED,
      InternshipStatus.CANCELLED,
    ] as const),
  };
}
export function fakeStudentInternshipComplete() {
  return {
    studentId: faker.number.int(),
    internshipId: faker.number.int(),
    mentorId: undefined,
    type: faker.helpers.arrayElement([
      InternshipType.INTRODUCTION,
      InternshipType.PROFESSIONAL,
      InternshipType.VOLUNTEER,
      InternshipType.PART_TIME,
    ] as const),
    status: faker.helpers.arrayElement([
      InternshipStatus.PENDING,
      InternshipStatus.STARTED,
      InternshipStatus.FINISHED,
      InternshipStatus.CANCELLED,
    ] as const),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
export function fakeMentor() {
  return {
    name: faker.person.fullName(),
    image: undefined,
    position: faker.lorem.words(5),
    password: faker.lorem.words(5),
    email: faker.internet.email(),
    phone: faker.lorem.words(5),
  };
}
export function fakeMentorComplete() {
  return {
    id: faker.number.int(),
    name: faker.person.fullName(),
    image: undefined,
    position: faker.lorem.words(5),
    password: faker.lorem.words(5),
    email: faker.internet.email(),
    phone: faker.lorem.words(5),
    companyId: faker.number.int(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function createStudents(numberOfStudents: number) {
  const majorData = fakeMajorComplete();
  await prisma.major.create({
    data: {
      ...majorData,
    },
  });

  for (let i = 0; i < numberOfStudents; i++) {
    const studentData = await fakeStudent();
    await prisma.student.create({
      data: studentData,
    });
  }
}

export async function createCompanies(numberOfStudents: number) {
  for (let i = 0; i < numberOfStudents; i++) {
    const data = await fakeCompany();
    await prisma.company.create({
      data: data,
    });
  }
}
