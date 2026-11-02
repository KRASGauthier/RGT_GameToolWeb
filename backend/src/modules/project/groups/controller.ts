import type { Request, Response } from "express";
import { hasGroup, hasProject } from "../../../util/UError.js";
import { MGroup } from "./schema.js";
import {
	IAPIGroup,
	IAPIGroups,
	TAPIGroupEdit,
	TAPIGroupEditChecker,
} from "../../../types/api/project/TAPIGroups.js";
import { checkApi } from "../../../../rgt/util/UApi.js";
import { projectHelperGetUsers } from "../controller.js";
import { MProjectUser } from "../projectUsers/schema.js";

//--------------------------------------------------
//                     ACCESS
//--------------------------------------------------
export const groupsGet = async (req: Request, res: Response) => {
	hasProject(req);
	const groups = await MGroup.find({ project: req.project._id });
	res.status(200).json({
		groups: await Promise.all(groups.map(async (group) => group.getJSON())),
	} as IAPIGroups);
};

//--------------------------------------------------
//                     MANAGE
//--------------------------------------------------
export const groupCreate = async (req: Request, res: Response) => {
	hasProject(req);
	const group = await MGroup.create({
		project: req.project._id.toString(),
		name: "New group",
		color: "#aaaaaa",
		icon: "groups",
	});

	res.status(201).json({
		group: await group.getJSON(),
	} as IAPIGroup);
};

export const groupEdit = async (req: Request, res: Response) => {
	hasGroup(req);
	const edit: TAPIGroupEdit = checkApi<TAPIGroupEdit>(req.body, TAPIGroupEditChecker);
	await req.group.set(edit);
	await req.group.save();
	groupsGet(req, res);
};

export const groupDelete = async (req: Request, res: Response) => {
	hasGroup(req);
	hasProject(req);

	await MProjectUser.updateMany(
		{ project: req.project._id },
		{ $pull: { groups: req.group._id } },
	);
	await req.group.deleteOne();

	const users = await projectHelperGetUsers(req);

	const groups = await MGroup.find({ project: req.project._id });
	res.status(200).json({
		groups: await Promise.all(groups.map(async (group) => group.getJSON())),
		users,
	} as IAPIGroups);
};
