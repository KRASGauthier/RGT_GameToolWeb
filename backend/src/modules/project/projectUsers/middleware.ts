import type { NextFunction, Request, Response } from "express";
import { hasProject } from "../../../util/UError.js";
import { MProjectUser } from "./schema.js";

export const verifyProjectUser = async (req: Request, res: Response, next: NextFunction) => {
	hasProject(req);
	if (!req.params.projectuser) throw { code: 400, message: "Missing project user UID" };
	const user = await MProjectUser.findOne({ user: req.params.projectuser, project: req.project._id });
	if (!user) throw { code: 404, message: "Project user not found" };
	req.projectUser = user;
	next();
};
