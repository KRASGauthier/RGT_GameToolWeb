import type { TAPIChecker } from "../../../../rgt/types/api/TAPI.js";
import type { TUID } from "../../../../rgt/types/TShared.js";
import type { IProject } from "../../data/project/TProject.js";
import type { IProjectUser } from "../../data/project/TProjectUser.js";
import { KProjectChecker, KProjectUserChecker } from "./TAPISharedCheckers.js";

//--------------------------------------------------
//                     SEND
//--------------------------------------------------
export interface IAPIProjectUserChangeGroup {
	groups: TUID[];
}

export const IAPIProjectUserChangeGroupChecker: TAPIChecker = {
	groups: {
		type: "string",
		isArray: true,
	},
};

export interface IAPIProjectUserAdd {
	user: TUID;
}

export const IAPIProjectUserAddChecker: TAPIChecker = {
	user: {
		type: "string",
	},
};

//--------------------------------------------------
//                    RECEIVE
//--------------------------------------------------
export interface IAPIProjectUserRcv {
	projectUser: IProjectUser;
}

export const IAPIProjectUserRcvChecker: TAPIChecker = {
	projectUser: {
		type: "checker",
		checker: KProjectUserChecker,
	},
};

export interface IAPIProjectUsersUpdate {
	project: IProject;
	users: IProjectUser[];
}

export const IAPIProjectUsersUpdateChecker: TAPIChecker = {
	project: {
		type: "checker",
		checker: KProjectChecker,
	},
	users: {
		type: "checker",
		isArray: true,
		checker: KProjectUserChecker,
	},
};
