import type { Request } from "express";
import { HydratedDocument } from "mongoose";
import { IProjectDB, IProjectDBMethods } from "../modules/project/schema.js";
import { IGroupDB, IGroupDBMethods } from "../modules/project/groups/schema.js";

export const hasProject: (
	req: Request,
) => asserts req is Request & { project: HydratedDocument<IProjectDB, IProjectDBMethods> } = (
	req: Request,
) => {
	if (!req.project) throw { code: 400, message: "Missing project" };
};

export const hasGroup: (
	req: Request,
) => asserts req is Request & { group: HydratedDocument<IGroupDB, IGroupDBMethods> } = (
	req: Request,
) => {
	if (!req.group) throw { code: 400, message: "Missing group" };
};
