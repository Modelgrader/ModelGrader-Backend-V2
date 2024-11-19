import { writeFileSync } from "fs";
import { ProgrammingLanguage } from "../constants/ProgrammingLanguages.constant";
import PythonRunner from "./languages/py-runner";
import { generateRandomString } from "../utils/generate-random-string";

type SandboxSectionStatus = "idle" | "busy";
export interface RuntimeOutput {
	isError: boolean;
	isTimeout: boolean;
	isMemoryExceeded: boolean;
	inputFilename: string;
	outputFilename: string;
	executionTimeMs: number;
}

export interface GradingResult {}

function createSandboxSectionStatusList(size: number): SandboxSectionStatus[] {
	const sandboxSectionStatusList: SandboxSectionStatus[] = [];
	for (let i = 0; i < size; i++) {
		sandboxSectionStatusList.push("idle");
	}
	return sandboxSectionStatusList;
}

export class Grader {
	static sandboxSectionStatusList: SandboxSectionStatus[] =
		createSandboxSectionStatusList(3);

	static writeInputFile(inputList: string[]) {
		const inputFilenameList: string[] = [];
		for (let i = 0; i < inputList.length; i++) {
			const filename = `${generateRandomString(16)}.txt`;
			writeFileSync(
				`./dumps/testcases/inputs/${filename}`,
				inputList[i],
				{
					encoding: "utf-8",
				}
			);
			inputFilenameList.push(filename);
		}
		return inputFilenameList;
	}

	static async generateOutput(
		code: string,
		inputFilenameList: string[],
		language: ProgrammingLanguage,
		timeLimitMs: number,
		memoryLimitBytes: number
	) {
		let sectionIndex = -1;
		while (sectionIndex === -1) {
			sectionIndex = this.sandboxSectionStatusList.findIndex(
				(status) => status === "idle"
			);
		}

		this.sandboxSectionStatusList[sectionIndex] = "busy";

		let outputList: RuntimeOutput[] = [];
		switch (language) {
			case "py":
				outputList = await PythonRunner.generateOutput(
					code,
					inputFilenameList,
					sectionIndex,
					timeLimitMs,
					memoryLimitBytes
				);
				break;

			default:
				throw new Error("Unsupported language");
		}

		this.sandboxSectionStatusList[sectionIndex] = "idle";

		return {
			isError: outputList.some((output) => output.isError),
			isTimeout: outputList.some((output) => output.isTimeout),
			isMemoryExceeded: outputList.some(
				(output) => output.isMemoryExceeded
			),
			outputList: outputList.sort(
				(a, b) =>
					inputFilenameList.indexOf(a.inputFilename) -
					inputFilenameList.indexOf(b.inputFilename)
			),
		};
	}

	static async grade(
		outputFilenameList: string[],
		expectedOutputFileList: string[]
	) {}
}
