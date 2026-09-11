import type { TAPIChecker } from "../../../../rgt/types/api/TAPI.js";
import type { IProject } from "../../data/project/TProject.js";

//--------------------------------------------------
//                    SHARED
//--------------------------------------------------
const projectChecker: TAPIChecker = {
	owner: {
		type: "string",
	},
	ownerName: {
		type: "string",
		optional: true,
	},
	uid: {
		type: "string",
	},
	name: {
		type: "string",
	},
	title: {
		type: "string",
		optional: true,
	},
	picture: {
		type: "string",
		optional: true,
	},
	version: {
		type: "checker",
		checker: {
			major: {
				type: "number",
			},
			minor: {
				type: "number",
			},
			patch: {
				type: "number",
			},
		},
	},
	engine: {
		type: "string",
	},
	language: {
		type: "string",
	},
	created: {
		type: "string",
	},
	lastOpened: {
		type: "string",
		optional: true,
	},
};

//--------------------------------------------------
//                     SEND
//--------------------------------------------------
export type TAPIProjectCreate = Omit<
	IProject,
	"uid" | "owner" | "ownerName" | "created" | "lastOpened"
>;
export const TAPIProjectCreateChecker: TAPIChecker = {
	name: projectChecker.name,
	title: projectChecker.title,
	picture: projectChecker.picture,
	version: projectChecker.version,
	engine: projectChecker.engine,
	language: projectChecker.language,
};

export type TAPIProjectModify = Partial<Pick<IProject, "name" | "title" | "version">>;
export const TAPIProjectModifyChecker: TAPIChecker = {
	name: {
		...projectChecker.name,
		optional: true,
	},
	title: {
		...projectChecker.title,
		optional: true,
	},
	version: {
		...projectChecker.version,
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
		checker: projectChecker,
	},
};

export interface IAPIProjectGetFromUser {
	projects: IProject[];
}
export const IAPIProjectGetFromUserChecker: TAPIChecker = {
	projects: {
		type: "array",
		checker: projectChecker,
	},
};

export interface IAPIProjectGet {
	project: IProject;
}
export const IAPIProjectGetChecker: TAPIChecker = {
	project: {
		type: "checker",
		checker: projectChecker,
	},
};
