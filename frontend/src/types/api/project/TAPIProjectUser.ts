import type { TAPIChecker } from "../../../../rgt/types/api/TAPI";
import type { TUID } from "../../../../rgt/types/TShared";
import type { IProject } from "../../data/project/TProject";
import type { IProjectUser } from "../../data/project/TProjectUser";
import { KProjectChecker, KProjectUserChecker } from "./TAPISharedCheckers";

//--------------------------------------------------
//                     SEND
//--------------------------------------------------
export interface IAPIProjectUserChangeGroup {
	groups: TUID[];
}

export const IAPIProjectUserChangeGroupChecker: TAPIChecker = {
	groups: {
		type: "array",
		checker: {
			value: {
				type: "string",
			},
		},
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
//                     SEND
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
		type: "array",
		checker: KProjectUserChecker,
	},
};
