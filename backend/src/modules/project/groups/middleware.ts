import type { NextFunction, Request, Response } from "express";
import { hasProject } from "../../../util/UError.js";
import { MGroup } from "./schema.js";

export const verifyGroup = async (req: Request, res: Response, next: NextFunction) => {
	hasProject(req);
	if (!req.params.group) throw { code: 400, message: "Missing group UID" };
	const group = await MGroup.findOne({ _id: req.params.group, project: req.project._id });
	if (!group) throw { code: 404, message: "Project not found" };
	req.group = group;
	next();
};
