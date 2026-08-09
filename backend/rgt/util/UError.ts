import type { Response } from "express";
import { IAPIErrors } from "../types/api/TAPI.js";
import mongoose from "mongoose";

export const handleError = (error: unknown, res: Response) => {
	if (error instanceof mongoose.Error.ValidationError) {
		res.status(400).json({ error: [error.message] } as IAPIErrors);
		return;
	} else if (error instanceof Error) {
		res.status(500).json({ error: [error.message] } as IAPIErrors);
		return;
	} else if (
		typeof error == "object" &&
		error != undefined &&
		error != null &&
		"message" in error
	) {
		res.status(
			"code" in error &&
				typeof error.code == "number" &&
				error.code != undefined &&
				error.code != null
				? error.code
				: 500,
		).json({ error: [error.message] } as IAPIErrors);
		return;
	}
	res.status(500).json({ error: ["Uknown eror"] } as IAPIErrors);
};
