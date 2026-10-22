import type { TAPIChecker } from "../../../../rgt/types/api/TAPI";
import type { IProject } from "../../data/project/TProject";
import type { IProjectUser } from "../../data/project/TProjectUser";

//--------------------------------------------------
//                    SHARED
//--------------------------------------------------
const projectChecker: TAPIChecker = {
	owner: {
		type: "string",
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
	cover: {
		type: "string",
		optional: true,
	},
	users: {
		type: "array",
		checker: {
			value: {
				type: "string",
			},
		},
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

const projectUserChecker: TAPIChecker = {
	uid: {
		type: "string",
	},
	username: {
		type: "string",
	},
	avatar: {
		type: "string",
		optional: true,
	},
	initials: {
		type: "string",
		optional: true,
	},
	project: {
		type: "string",
	},
	groups: {
		type: "array",
		checker: {
			value: {
				type: "string",
			},
		},
	},
	isOwner: {
		type: "boolean",
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
	cover: projectChecker.cover,
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
	owners: IProjectUser[]
}
export const IAPIProjectGetFromUserChecker: TAPIChecker = {
	projects: {
		type: "array",
		checker: projectChecker,
	},
	owners: {
		type: "array",
		checker: projectUserChecker,
	},
};

export interface IAPIProjectGet {
	project: IProject;
	users: IProjectUser[];
}
export const IAPIProjectGetChecker: TAPIChecker = {
	project: {
		type: "checker",
		checker: projectChecker,
	},
	users: {
		type: "array",
		checker: projectUserChecker,
	},
};
