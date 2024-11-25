import { FastifyInstance } from "fastify";
import { problemGuard } from "../middleware/problem-guard";
import CollectionView from "../views/CollectionView";
import { collectionGuard } from "../middleware/collection-guard";

export function createCollectionRoute(server: FastifyInstance) {
    
    server.route({
        method: "POST",
        url: "/collections",
        preHandler: [],
        handler: CollectionView.create,
    })
    server.route({
        method: "PUT",
        url: "/collections/:collectionId",
        preHandler: [collectionGuard],
        handler: CollectionView.update,
    })
    server.route({
        method: "DELETE",
        url: "/collections/:collectionId",
        preHandler: [collectionGuard],
        handler: CollectionView.delete,
    })
    server.route({
        method: "GET",
        url: "/collections/:collectionId",
        preHandler: [],
        handler: CollectionView.get,
    })

}