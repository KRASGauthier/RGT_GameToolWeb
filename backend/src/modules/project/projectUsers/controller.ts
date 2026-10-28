import type { Request, Response } from "express";
import { hasUser } from "../../../../rgt/util/UError.js";
import { IProjectUser } from "../../../types/data/project/TProjectUser.js";
import { hasProject } from "../../../util/UError.js";
import { MProjectUser } from "./schema.js";

export const projectUserCreate = async (user: string, project: string): Promise<IProjectUser> => {
	const nUser = await MProjectUser.create({
		user: user,
		project: project
	})
	
	return await nUser.getData()
}

export const projectUserChangeGroup = async (req: Request, res: Response) => {
	hasUser(req);
	hasProject(req)
	const data: TAPIProjectCreate = checkApi(req.body, TAPIProjectCreateChecker);

	const project = await MProject.create({
		owner: req.user,
		...data,
	});
	console.log("END");

	projectUserCreate(req.user, project._id.toString());

	res.status(201).json({ project: project.toJSON<IProject>() } as IAPIProject);
};
