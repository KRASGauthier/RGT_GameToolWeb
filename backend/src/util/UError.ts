import type { Request } from "express";
import { HydratedDocument } from "mongoose";
import { IProjectDB, IProjectDBMethods } from "../modules/project/schema.js";
import { IGroupDB, IGroupDBMethods } from "../modules/project/groups/schema.js";
import { IProjectUserDB, IProjectUserDBMethods } from "../modules/project/projectUsers/schema.js";
import { ITagDB, ITagDBMethods } from "../modules/project/tags/schema.js";
import { ITodoDB, ITodoDBMethods } from "../modules/project/todo/schema.js";


//====================== SHARED ======================
export const hasTag: (req: Request) => asserts req is Request & {
	tag: HydratedDocument<ITagDB, ITagDBMethods>;
} = (req: Request) => {
	if (!req.tag) throw { code: 400, message: "Missing tag" };
};



//====================== MAIN ======================
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

export const hasProjectUser: (req: Request) => asserts req is Request & {
	projectUser: HydratedDocument<IProjectUserDB, IProjectUserDBMethods>;
} = (req: Request) => {
	if (!req.projectUser) throw { code: 400, message: "Missing project user" };
};
//====================== PROJECT ======================
export const hasTodo: (req: Request) => asserts req is Request & {
	todo: HydratedDocument<ITodoDB, ITodoDBMethods>;
} = (req: Request) => {
	if (!req.todo) throw { code: 400, message: "Missing todo" };
};