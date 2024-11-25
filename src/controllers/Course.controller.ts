import { AccountSecuredFields } from "../constants/Account.constant";
import { prisma } from "../database";

export interface CreateCoursePayload {
    title: string;
    description: string;
    collectionIds: string[];
}

export interface UpdateCoursePayload extends CreateCoursePayload {}

export default class CourseController {
    static async create(payload: CreateCoursePayload, accessToken: string) {
        const creator = await prisma.accountSecret.findUniqueOrThrow({
            where: { accessToken }, include: {account: true},
        });

        const collections = await prisma.collection.findMany({
            where: {
                id: {
                    in: payload.collectionIds,
                },
            },
        });

        return prisma.course.create({
            data: {
                title: payload.title,
                description: payload.description,
                creatorId: creator.id,
                collections: {
                    connect: collections.map((problem) => ({
                        id: problem.id,
                    })),
                },
            },
        });
    }

    static async update(courseId: string, payload: UpdateCoursePayload) {
        const collections = await prisma.collection.findMany({
            where: {
                id: {
                    in: payload.collectionIds,
                },
            },
        });

        return prisma.course.update({
            where: { id: courseId },
            data: {
                title: payload.title,
                description: payload.description,
                collections: {
                    set: collections.map((problem) => ({
                        id: problem.id,
                    })),
                },
            },
        });
    }

    static async delete(courseId: string) {
        return prisma.course.delete({
            where: { id: courseId },
        });
    }

    static async get(courseId: string) {
        return prisma.course.findUniqueOrThrow({
            where: { id: courseId },
            include: {
                creator: AccountSecuredFields,
                collections: true,
            },
        });
    }
}