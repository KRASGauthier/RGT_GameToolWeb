import type { Request, Response } from "express";
import {
	IAPIProject,
	IAPIProjectGet,
	IAPIProjectGetFromUser,
	TAPIProjectCreate,
	TAPIProjectCreateChecker,
	TAPIProjectModify,
	TAPIProjectModifyChecker,
} from "../../types/api/project/TAPIProject.js";
import { checkApi } from "../../../rgt/util/UApi.js";
import { hasUser } from "../../../rgt/util/UError.js";
import { MProject } from "./schema.js";
import { IProject } from "../../types/data/project/TProject.js";
import { hasProject } from "../../util/UError.js";
import sharp from "sharp";
import { makeFrontPath, makePath } from "../../../rgt/util/UImages.js";
import { IMG_PROJECT, IMG_PROJECT_COVER, IMG_PROJECT_UID } from "../../consts.js";
import { projectUserCreate } from "./projectUsers/controller.js";
import { MProjectUser } from "./projectUsers/schema.js";
import { IProjectUser } from "../../types/data/project/TProjectUser.js";
import { MGroup } from "./groups/schema.js";

//--------------------------------------------------
//                     MANAGE
//--------------------------------------------------
export const createProject = async (req: Request, res: Response) => {
	hasUser(req);
	const data: TAPIProjectCreate = checkApi(req.body, TAPIProjectCreateChecker);

	const project = await MProject.create({
		owner: req.user,
		...data,
	});
	console.log("END");

	projectUserCreate(req.user, project._id.toString());

	res.status(201).json({ project: project.toJSON<IProject>() } as IAPIProject);
};

export const projectModify = async (req: Request, res: Response) => {
	hasUser(req);
	hasProject(req);
	const data: TAPIProjectModify = checkApi<TAPIProjectModify>(req.body, TAPIProjectModifyChecker);
	await req.project.set(data);
	await req.project.save();

	res.status(201).json({ project: await req.project.getProjectFull() } as IAPIProject);
};
export const projectModifyPicture = async (req: Request, res: Response) => {
	hasProject(req);
	if (!req.file?.buffer) throw { code: 400, message: "missign image" };

	const picPath =
		makePath(IMG_PROJECT + IMG_PROJECT_UID.replaceAll(":uid", req.project._id.toString())) +
		IMG_PROJECT_COVER;
	await sharp(req.file.buffer)
		.resize(1920, 1080, { fit: "cover", position: "center" })
		.png()
		.toFile(picPath);

	req.project.cover =
		makeFrontPath(
			IMG_PROJECT + IMG_PROJECT_UID.replaceAll(":uid", req.project._id.toString()),
		) + IMG_PROJECT_COVER;
	await req.project.save();

	res.status(201).json({ project: await req.project.getProjectFull() } as IAPIProject);
};

//--------------------------------------------------
//                    ACCESS
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
		owners: await Promise.all(
			projects.map(async (project) => {
				const owner = await MProjectUser.findOne({user: project.owner, project: project.id})
				if(!owner)
					return undefined
				return owner.getData();
			}),	
		)
	} as IAPIProjectGetFromUser);
};

export const projectGet = async (req: Request, res: Response) => {
	hasUser(req);
	hasProject(req);
	if (!req.project) return;

	//USERS
	const users: IProjectUser[] = (await Promise.all(req.project.users.map(async (user) => {
		const userFound = await MProjectUser.findOne({user: user, project: req.project._id});
		if(userFound)
			return userFound.getData();
	}))).filter((user: IProjectUser | undefined) => user ? true : false) as IProjectUser[];
	const owner = await MProjectUser.findOne({user: req.project.owner.toString(), project: req.project._id})
	if(owner) {
		users.push({
			...(await owner.getData()),
			isOwner: true
		})
	}

	//Gorups
	const groups = await MGroup.find({ project: req.project._id });

	res.status(200).json({
		project: await req.project.getProjectFull(),
		users,
		groups: await Promise.all(groups.map(async (group) => group.getJSON()))
	} as IAPIProjectGet);
};
