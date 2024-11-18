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

	static async generateOutput(
		code: string,
		inputList: string[],
		language: ProgrammingLanguage
	) {
		const sectionIndex = this.sandboxSectionStatusList.findIndex(
			(status) => status === "idle"
		);
        
		this.sandboxSectionStatusList[sectionIndex] = "busy";
		
        const inputFilenameList = [];
		for (let i = 0; i < inputList.length; i++) {
			// Create and write
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

		let outputList: RuntimeOutput[] = [];
		switch (language) {
			case "py":
				outputList = await PythonRunner.generateOutput(
					code,
					inputFilenameList,
					sectionIndex,
					1000,
                    1024 * 1024
				);
				break;
		}
		
        this.sandboxSectionStatusList[sectionIndex] = "idle";

        return {
            isError: outputList.some(output => output.isError),
            isTimeout: outputList.some(output => output.isTimeout),
            isMemoryExceeded: outputList.some(output => output.isMemoryExceeded),
            outputList
        };
	}
}
