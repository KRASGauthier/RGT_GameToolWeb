import type { NextFunction, Request, Response } from "express";
import { hasProject } from "../../../util/UError.js";
import { MTag } from "./schema.js";

export const verifyTag = async (req: Request, res: Response, next: NextFunction) => {
	hasProject(req);
	if (!req.params.tag) throw { code: 400, message: "Missing tag UID" };
	const tag = await MTag.findOne({ _id: req.params.tag, project: req.project._id });
	if (!tag) throw { code: 404, message: "Tag not found" };
	req.tag = tag;
	next();
};
