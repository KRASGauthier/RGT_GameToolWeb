import type { Request, Response } from "express";
import e from "express";
import rateLimit, { Options } from "express-rate-limit";
import { TIME_1S } from "../consts.js";

const createLimiter = (timeMS: number, max?: number) => {
	return rateLimit({
		windowMs: timeMS,
		max: max ?? 5,
		message: { message: `Too many requests, please try again after ${timeMS / TIME_1S}s` },
		handler: (req: Request, res: Response, next: e.NextFunction, options: Options) => {
			throw { code: 429, message: options.message.message };
		},
		standardHeaders: true,
		legacyHeaders: false,
	});
};

export default createLimiter;
