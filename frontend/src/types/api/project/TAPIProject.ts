import type { TAPIChecker } from "../../../../rgt/types/api/TAPI";
import type { IGroup } from "../../data/project/TGroups";
import type { IProject } from "../../data/project/TProject";
import type { IProjectUser } from "../../data/project/TProjectUser";
import { KGroupChecker, KProjectChecker, KProjectUserChecker } from "./TAPISharedCheckers";

//--------------------------------------------------
//                     SEND
//--------------------------------------------------
export type TAPIProjectCreate = Omit<
	IProject,
	"uid" | "owner" | "ownerName" | "created" | "lastOpened"
>;
export const TAPIProjectCreateChecker: TAPIChecker = {
	name: KProjectChecker.name,
	title: KProjectChecker.title,
	cover: KProjectChecker.cover,
	version: KProjectChecker.version,
	engine: KProjectChecker.engine,
	language: KProjectChecker.language,
};

export type TAPIProjectModify = Partial<Pick<IProject, "name" | "title" | "version">>;
export const TAPIProjectModifyChecker: TAPIChecker = {
	name: {
		...KProjectChecker.name,
		optional: true,
	},
	title: {
		...KProjectChecker.title,
		optional: true,
	},
	version: {
		...KProjectChecker.version,
		optional: true,
	},
};

//--------------------------------------------------
//                    RECEIVE
//--------------------------------------------------
export interface IAPIProject {
	project: IProject;
}
export const IAPIProjectChecker: TAPIChecker = {
	project: {
		type: "checker",
		checker: KProjectChecker,
	},
};

export interface IAPIProjectGetFromUser {
	projects: IProject[];
	owners: IProjectUser[];
}
export const IAPIProjectGetFromUserChecker: TAPIChecker = {
	projects: {
		type: "array",
		checker: KProjectChecker,
	},
	owners: {
		type: "array",
		checker: KProjectUserChecker,
	},
};

export interface IAPIProjectGet {
	project: IProject;
	users: IProjectUser[];
	groups: IGroup[];
}
export const IAPIProjectGetChecker: TAPIChecker = {
	project: {
		type: "checker",
		checker: KProjectChecker,
	},
	users: {
		type: "array",
		checker: KProjectUserChecker,
	},
	groups: {
		type: "array",
		checker: KGroupChecker,
	},
};
