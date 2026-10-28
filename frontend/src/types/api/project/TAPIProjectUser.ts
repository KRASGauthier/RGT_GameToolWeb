import type { TAPIChecker } from "../../../../rgt/types/api/TAPI";
import type { TUID } from "../../../../rgt/types/TShared";
import type { IProjectUser } from "../../data/project/TProjectUser";

//--------------------------------------------------
//                   SAHRED
//--------------------------------------------------
export const projectUserChecker: TAPIChecker = {
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

//--------------------------------------------------
//                     SEND
//--------------------------------------------------
export interface IAPIProjectUserRcv {
	projectUser: IProjectUser;
}

export const IAPIProjectUserRcvChecker: TAPIChecker = {
	projectUser: {
		type: "checker",
		checker: projectUserChecker,
	},
};
