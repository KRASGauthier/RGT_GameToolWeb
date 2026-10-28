import type { TAPIChecker } from "../../../../rgt/types/api/TAPI.js";
import type { TUID } from "../../../../rgt/types/TShared.js";
import type { IProjectUser } from "../../data/project/TProjectUser.js";


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
	group: TUID,
}

export const IAPIProjectUserChangeGroupChecker: TAPIChecker = {
	group: {
		type: "string",
	},
};

//--------------------------------------------------
//                     SEND
//--------------------------------------------------
export interface IAPIProjectUserRcv {
	projectUser: IProjectUser,
}

export const IAPIProjectUserRcvChecker: TAPIChecker = {
	projectUser: {
		type: "checker",
		checker: projectUserChecker,
	},
};