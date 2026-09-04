import type { Request, Response } from "express";
import {
	IAPIProjectCreate,
	IAPIProjectGetFromUser,
	TAPIProjectCreate,
	TAPIProjectCreateChecker,
} from "../../types/api/project/TAPIProject.js";
import { checkApi } from "../../../rgt/util/UApi.js";
import { hasUser } from "../../../rgt/util/UError.js";
import { MProject } from "./schema.js";
import { IProject } from "../../types/data/project/TProject.js";

//--------------------------------------------------
//                     MANAGE
//--------------------------------------------------
export const projectGetAllFromUser = async (req: Request, res: Response) => {
	hasUser(req);
	const projects = await MProject.find({ owner: req.user });
	res.status(200).json({
		projects: await Promise.all(
			projects.map((project) => {
				return project.getProjectFull();
			}),
		),
	} as IAPIProjectGetFromUser);
};

export const createProject = async (req: Request, res: Response) => {
	hasUser(req);
	const data: TAPIProjectCreate = checkApi(req.body, TAPIProjectCreateChecker);

	const project = await MProject.create({
		owner: req.user,
		...data,
	});

	res.status(201).json({ project: project.toJSON<IProject>() } as IAPIProjectCreate);
};
