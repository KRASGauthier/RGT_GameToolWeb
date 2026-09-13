import type { Request } from "express";
import { HydratedDocument } from "mongoose";
import { IProjectDB, IProjectDBMethods } from "../modules/project/project/schema.js";

export const hasProject: (
	req: Request,
) => asserts req is Request & { project: HydratedDocument<IProjectDB, IProjectDBMethods> } = (
	req: Request,
) => {
	if (!req.project) throw { code: 400, message: "Missing project" };
};
