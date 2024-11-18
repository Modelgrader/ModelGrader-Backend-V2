import ProblemController from "../controllers/Problem.controller";

export default class ProblemView {
	static async create() {
		return ProblemController.create();
	}
}
