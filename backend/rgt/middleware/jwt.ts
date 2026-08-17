import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { IUserTokenMin } from "../types/data/TUser.js";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
	let authHeader: string | string[] | undefined =
		req.headers.authorization || req.headers.Authorization;

	if (Array.isArray(authHeader)) {
		if (authHeader.length == 0) throw { code: 401, message: "Unauthorized" };
		authHeader = authHeader[0];
	}

	if (!authHeader || !authHeader.startsWith("Bearer "))
		throw { code: 401, message: "Unauthorized" };

	const accessToken = authHeader.split(" ")[1];

	if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET)
		throw { code: 500, message: "failed to start JWT" };

	let decoded: IUserTokenMin;
	try {
		decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET) as IUserTokenMin;
		req.user = decoded.uid;
	} catch {
		throw { code: 401, message: "Unauthorized" };
	}

	next();
};
