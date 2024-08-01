import { faker } from "@faker-js/faker";
import {
	AccountType,
	ApplicationStatus,
	InternshipStatus,
	InternshipType,
	PrismaClient,
} from "@prisma/client";
import { password } from "./faker-helpers";

export const prisma = new PrismaClient();

export async function fakeStudent() {
	const hashedPassword = await password();
	return {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		password: hashedPassword,
		phone: faker.lorem.words(5),
		address: faker.lorem.words(5),
		majorId: faker.number.int({ min: 1, max: 1 }),
		image: undefined,
		document: undefined,
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
		isApproved: true,
		image: undefined,
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
		image: undefined,
		isApproved: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}
export function fakeApplicationComplete() {
	return {
		id: faker.number.int(),
		studentId: faker.number.int(),
		internshipId: faker.number.int(),
		status: ApplicationStatus.pending,
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
		name: faker.person.fullName(),
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}
export async function fakeEmployee() {
	const hashedPassword = await password();
	return {
		name: faker.person.fullName(),
		password: hashedPassword,
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
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}
export function fakeInternship() {
	return {
		title: faker.lorem.words(5),
		type: faker.helpers.arrayElement([
			InternshipType.introduction,
			InternshipType.professional,
			InternshipType.volunteer,
			InternshipType.part_time,
			InternshipType.abcc,
		] as const),
		salary: faker.datatype.boolean(),
		enrollmentEndDate: faker.date.anytime(),
		startDate: faker.date.anytime(),
		endDate: faker.date.anytime(),
	};
}
export function fakeInternshipComplete() {
	return {
		title: faker.lorem.words(5),
		type: faker.helpers.arrayElement([
			InternshipType.introduction,
			InternshipType.professional,
			InternshipType.volunteer,
			InternshipType.part_time,
			InternshipType.abcc,
		] as const),
		companyId: faker.number.int({ min: 1, max: 1 }),
		salary: faker.datatype.boolean(),
		createdAt: new Date(),
		enrollmentEndDate: faker.date.anytime(),
		startDate: faker.date.anytime(),
		endDate: faker.date.anytime(),
		updatedAt: new Date(),
	};
}
export function fakeInternshipLimit() {
	return {
		studentLimit: faker.number.int(),
	};
}
export function fakeInternshipLimitComplete() {
	return {
		id: faker.number.int(),
		internshipId: faker.number.int(),
		majorId: faker.number.int(),
		studentLimit: faker.number.int(),
		approvedApps: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}
export function fakeStudentInternship() {
	return {
		image: undefined,
		type: faker.helpers.arrayElement([
			InternshipType.introduction,
			InternshipType.professional,
			InternshipType.volunteer,
			InternshipType.part_time,
			InternshipType.abcc,
		] as const),
		status: faker.helpers.arrayElement([
			InternshipStatus.pending,
			InternshipStatus.started,
			InternshipStatus.finished,
			InternshipStatus.cancelled,
		] as const),
	};
}
export function fakeStudentInternshipComplete() {
	return {
		id: faker.number.int(),
		studentId: faker.number.int(),
		internshipId: faker.number.int(),
		mentorId: undefined,
		image: undefined,
		type: faker.helpers.arrayElement([
			InternshipType.introduction,
			InternshipType.professional,
			InternshipType.volunteer,
			InternshipType.part_time,
			InternshipType.abcc,
		] as const),
		status: faker.helpers.arrayElement([
			InternshipStatus.pending,
			InternshipStatus.started,
			InternshipStatus.finished,
			InternshipStatus.cancelled,
		] as const),
		createdAt: new Date(),
		updatedAt: new Date(),
	};
}
export function fakeFeedback() {
	return {
		content: faker.lorem.words(5),
		account: faker.helpers.arrayElement([
			AccountType.student,
			AccountType.employee,
			AccountType.company,
		] as const),
	};
}
export function fakeFeedbackComplete() {
	return {
		id: faker.number.int(),
		userId: faker.number.int(),
		content: faker.lorem.words(5),
		account: faker.helpers.arrayElement([
			AccountType.student,
			AccountType.employee,
			AccountType.company,
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
