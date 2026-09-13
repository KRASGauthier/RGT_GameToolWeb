import fs from "fs";
import { STATIC_IMAGES } from "../../src/consts.js";

export function makePath(...paths: string[]): string {
	let out: string = process.env.BACKEND_UPLOADE_LOCATION ?? "/home/app/uploaded-dev";
	paths.forEach((path: string) => {
		out += path;
	});

	if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

	return out;
}

export function getPath(...paths: string[]): string {
	let out: string = process.env.BACKEND_UPLOADE_LOCATION ?? "/home/app/uploaded-dev";
	paths.forEach((path: string) => {
		out += path;
	});
	return out;
}

export function makeFrontPath(...paths: string[]): string {
	let out: string = STATIC_IMAGES;
	paths.forEach((path: string) => {
		out += path;
	});
	return out;
}
