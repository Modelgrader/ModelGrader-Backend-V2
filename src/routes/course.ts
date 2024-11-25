import { FastifyInstance } from "fastify";
import { courseGuard } from "../middleware/course-guard";
import CourseView from "../views/CourseView";

export function createCollectionRoute(server: FastifyInstance) {
    
    server.route({
        method: "POST",
        url: "/courses",
        preHandler: [],
        handler: CourseView.create,
    })
    server.route({
        method: "PUT",
        url: "/courses/:courseId",
        preHandler: [courseGuard],
        handler: CourseView.update,
    })
    server.route({
        method: "DELETE",
        url: "/courses/:courseId",
        preHandler: [courseGuard],
        handler: CourseView.delete,
    })
    server.route({
        method: "GET",
        url: "/courses/:courseId",
        preHandler: [],
        handler: CourseView.get,
    })

}