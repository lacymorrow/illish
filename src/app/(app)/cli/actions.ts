"use server";

import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { ReadableStream } from "stream/web";

export async function getProjectRoot(): Promise<string> {
	const root = process.cwd();

	try {
		await fs.access(path.join(root, "package.json"));
		await fs.access(path.join(root, "components.json"));
		return root;
	} catch {
		throw new Error(
			"Could not find project root. Make sure you are in a Next.js project with components.json",
		);
	}
}

export async function runCliCommand(
	command: string,
	args: string[],
	cwd: string,
) {
	console.log("Running command", command, args, cwd);
	return new Promise<ReadableStream>((resolve, reject) => {
		const child = exec(`${command} ${args.join(" ")}`, { cwd });

		const stream = new ReadableStream({
			start(controller) {
				child.stdout?.on("data", (data) => {
					controller.enqueue(new TextEncoder().encode(data.toString()));
				});

				child.stderr?.on("data", (data) => {
					controller.enqueue(new TextEncoder().encode(data.toString()));
				});

				child.on("close", (code) => {
					if (code === 0) {
						controller.close();
					} else {
						controller.error(new Error(`Process exited with code ${code}`));
					}
				});

				child.on("error", (err) => {
					controller.error(err);
				});
			},
		});

		resolve(stream);
	});
}
