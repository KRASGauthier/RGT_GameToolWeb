import type { Request, Response } from "express";
import { hasProject, hasTag } from "../../../util/UError.js";
import {
	IAPITagCreate,
	IAPITagCreateChecker,
	IAPITagEdit,
	IAPITagEditChecker,
	IAPITagGet,
} from "../../../../rgt/types/api/tags/TAPITags.js";
import { checkApi } from "../../../../rgt/util/UApi.js";
import { MTag } from "./schema.js";

//--------------------------------------------------
//                     ACCESSS
//--------------------------------------------------
export const tagGetAll = async (req: Request, res: Response, _?: unknown, status: number = 200) => {
	hasProject(req);

	const tags = await MTag.find({ project: req.project._id });

	res.status(status).json({
		tags: await Promise.all(tags.map((tag) => tag.getData())),
	} as IAPITagGet);
};

//--------------------------------------------------
//                     MANAGE
//--------------------------------------------------
export const tagCreate = async (req: Request, res: Response) => {
	hasProject(req);

	const data: IAPITagCreate = checkApi<IAPITagCreate>(req.body, IAPITagCreateChecker);
	await MTag.create({
		project: req.project._id,
		name: data.tag.name ?? "",
		icon: data.tag.icon ?? "tag",
		color: data.tag.color ?? "#1795FA",
	});

	tagGetAll(req, res, undefined, 201);
};

export const tagEdit = async (req: Request, res: Response) => {
	hasTag(req);
	const data: IAPITagEdit = checkApi<IAPITagEdit>(req.body, IAPITagEditChecker);
	await req.tag.updateOne(data.tag);
	tagGetAll(req, res);
};
