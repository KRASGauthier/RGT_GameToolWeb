import type { NextFunction, Request, Response } from "express";
import { MProject } from "../modules/project/project/schema.js";
import { hasUser } from "../../rgt/util/UError.js";

export const verifyProject = async (req: Request, res: Response, next: NextFunction) => {
	hasUser(req);
	let projectUID: string | string[] | undefined = req.params.uid
	if(!projectUID && req.body?.project && typeof req.body.project == "string")
		projectUID = req.body.project;
	if(!projectUID && req.query?.project && typeof req.query.project == "string")
		projectUID = req.query.project;
	if(Array.isArray(projectUID))
		projectUID = projectUID[0];

	if (!projectUID) throw { code: 400, message: "Missing project UID" };
	const project = await MProject.findOne({ _id: projectUID, owner: req.user });
	if (!project) throw { code: 404, message: "Project not found" };
	req.project = project;
	next();
};
