import { exec } from "child_process";
import { readdirSync, writeFileSync } from "fs";
import { RuntimeOutput } from "..";
import { generateRandomString } from "../../utils/generate-random-string";

export default class PythonRunner {
	static async generateOutput(
		code: string,
		inputFilenameList: string[],
		sectionIndex: number,
		timeLimitMs: number,
        memoryLimitBytes: number
	): Promise<RuntimeOutput[]> {
		writeFileSync(`./src/grader/sandbox/${sectionIndex}/code.py`, code);

		const taskList: Promise<RuntimeOutput>[] = [];

		readdirSync("./dumps/testcases/inputs")
			.filter((filename) => inputFilenameList.includes(filename))
			.forEach(async (filename) => {
				if (!filename.endsWith(".txt")) return;
				const task = new Promise((resolve, _) => {
					const startTime = Date.now();
					exec(
						`python ./src/grader/sandbox/${sectionIndex}/code.py < ./dumps/testcases/inputs/${filename}`,
						{
							timeout: timeLimitMs,
                            maxBuffer: memoryLimitBytes,
						},
						(err, stdout, _) => {
							const endTime = Date.now();
							const executionTime = endTime - startTime;
							if (err) {
                                let isMemoryExceeded = false;

                                if (String(err.code) === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') {
                                    isMemoryExceeded = true;
                                }

								const censoredFilepathRegex = /".*code.py"/;
								const protectedErrorMessage =
									err.message.replace(
										censoredFilepathRegex,
										"**********"
									);
                                

                                const outputFilename = `${generateRandomString(16)}.txt`;
                                writeFileSync(`./dumps/testcases/outputs/${outputFilename}`, protectedErrorMessage);
								resolve({
									isError: true,
									isTimeout: executionTime >= timeLimitMs,
                                    isMemoryExceeded,
                                    inputFilename: filename,
									outputFilename: outputFilename,
									executionTimeMs: executionTime,
								});
								return;
							}
                            const outputFilename = `${generateRandomString(16)}.txt`;
                            writeFileSync(`./dumps/testcases/outputs/${outputFilename}`, stdout);
							resolve({
								isError: false,
								isTimeout: false,
                                isMemoryExceeded: false,
                                inputFilename: filename,
								outputFilename: outputFilename,
								executionTimeMs: executionTime,
							});
						}
					);
				}) as Promise<RuntimeOutput>;
				taskList.push(task);
			});

		const result = await Promise.all(taskList);
		return result;
	}
}
