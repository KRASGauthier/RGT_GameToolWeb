import type { Response } from "express";
import { IAPIErrors } from "../types/api/TAPI.js";
import mongoose from "mongoose";
import { uErrorResponse } from "./ULog.js";

export const handleError = (error: unknown, res: Response) => {
	if (error instanceof mongoose.Error.ValidationError) {
		uErrorResponse(error.message, 400);
		const outError: IAPIErrors = { error: [error.message] } as IAPIErrors;
		res.status(400).json(outError);
		return;
	} else if (error instanceof mongoose.mongo.MongoServerError && error.code == 11000) {
		uErrorResponse(error.message, 400);
		const messages: string[] = [];
		Object.keys(error.keyValue).forEach((key: string) => {
			messages.push(`This '${key}' is already being used.`);
		});
		const outError: IAPIErrors = { error: messages, errorInfo: error.keyValue } as IAPIErrors;
		res.status(400).json(outError);
		return;
	} else if (error instanceof Error) {
		uErrorResponse(error.message, 500);
		res.status(500).json({ error: [error.message] } as IAPIErrors);
		return;
	} else if (
		typeof error == "object" &&
		error != undefined &&
		error != null &&
		"message" in error
	) {
		const code =
			"code" in error &&
			typeof error.code == "number" &&
			error.code != undefined &&
			error.code != null
				? error.code
				: 500;
		uErrorResponse(
			error.message,
			code,
			"log" in error && typeof error.log == "string" ? error.log : undefined,
		);
		res.status(code).json({ error: [error.message] } as IAPIErrors);
		console.log(error);
		if ("mutex" in error) (error.mutex as () => void)();
		return;
	}
	uErrorResponse("Unknown error", 500);
	res.status(500).json({ error: ["Unknown error"] } as IAPIErrors);
};

export const checkField = (field: string, data: Record<string, unknown>, type?: string) => {
	if (!(field in data)) throw { code: 400, message: `Required field '${field}' is missing` };
	if (type && typeof data[field] != type)
		throw { code: 400, message: `Field '${field}' is not of type ${type}` };
};
