import type { TAPIChecker } from "../../../../rgt/types/api/TAPI";
import type { IGroup } from "../../data/project/TGroups";
import type { IProjectUser } from "../../data/project/TProjectUser";
import { KGroupChecker, KProjectUserChecker } from "./TAPISharedCheckers";

//--------------------------------------------------
//                      SEND
//--------------------------------------------------
export type TAPIGroupEdit = Partial<Omit<IGroup, "uid" | "count">>;
export const TAPIGroupEditChecker: TAPIChecker = {
	name: {
		...KGroupChecker.name,
		optional: true,
	},
	icon: {
		...KGroupChecker.icon,
		optional: true,
	},
	color: {
		...KGroupChecker.color,
		optional: true,
	},
};

//--------------------------------------------------
//                     RECIEVE
//--------------------------------------------------
export interface IAPIGroup {
	group: IGroup;
}

export const IAPIGroupChecker: TAPIChecker = {
	group: {
		type: "checker",
		checker: KGroupChecker,
	},
};

export interface IAPIGroups {
	groups: IGroup[];
}

export const IAPIGroupsChecker: TAPIChecker = {
	groups: {
		type: "array",
		checker: KGroupChecker,
	},
};

export interface IAPIGroupsDelete {
	groups: IGroup[];
	users: IProjectUser[];
}

export const IAPIGroupsDeleteChecker: TAPIChecker = {
	groups: {
		type: "array",
		checker: KGroupChecker,
	},
	users: {
		type: "array",
		checker: KProjectUserChecker,
	},
};
