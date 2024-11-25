import { AccountSecuredFields } from "../constants/Account.constant";
import { prisma } from "../database";

export interface CreateCollectionPayload {
    title: string;
    description: string;
    problemIds: string[];
}

export interface UpdateCollectionPayload extends CreateCollectionPayload {}

export default class CollectionController {
    static async create(payload: CreateCollectionPayload, accessToken: string) {
        const creatorSecret = await prisma.accountSecret.findUniqueOrThrow({
            where: { accessToken }, include: {account: true},
        });

        const creator = creatorSecret.account

        const problems = await prisma.problem.findMany({
            where: {
                id: {
                    in: payload.problemIds,
                },
            },
        });

        return prisma.collection.create({
            data: {
                title: payload.title,
                description: payload.description,
                creatorId: creator.id,
                problems: {
                    connect: problems.map((problem) => ({
                        id: problem.id,
                    })),
                },
            },
        });
    }

    static async update(collectionId: string, payload: UpdateCollectionPayload) {
        const problems = await prisma.problem.findMany({
            where: {
                id: {
                    in: payload.problemIds,
                },
            },
        });

        return prisma.collection.update({
            where: { id: collectionId },
            data: {
                title: payload.title,
                description: payload.description,
                problems: {
                    set: problems.map((problem) => ({
                        id: problem.id,
                    })),
                },
            },
        });
    }

    static async delete(collectionId: string) {
        return prisma.collection.delete({
            where: { id: collectionId },
        });
    }

    static async get(collectionId: string) {
        return prisma.collection.findUniqueOrThrow({
            where: { id: collectionId },
            include: {
                creator: AccountSecuredFields,
                problems: true,
            },
        });
    }
}