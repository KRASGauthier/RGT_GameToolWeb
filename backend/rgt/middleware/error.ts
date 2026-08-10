import type { ErrorRequestHandler, NextFunction } from "express";
import type { Request, Response } from "express";
import { handleError } from "../util/UError.js";

export const errorMiddleware: ErrorRequestHandler = (
	error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	void next;
	handleError(error, res);
};
