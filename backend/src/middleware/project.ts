import type { NextFunction, Request, Response } from "express";
import { MProject } from "../modules/project/schema.js";
import { hasUser } from "../../rgt/util/UError.js";


export const verifyProject = async (req: Request, res: Response, next: NextFunction) => {
	hasUser(req);
	if(!req.params.uid)
		throw {code: 400, message: "Missing project UID"};
	const project = await MProject.findOne({_id: req.params.uid, owner: req.user})
	if(!project)
		throw {code: 404, message: "Project not found"};
	req.project = project;
	next();
}