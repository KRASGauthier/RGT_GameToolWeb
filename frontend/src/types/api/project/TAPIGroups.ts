import type { TAPIChecker } from "../../../../rgt/types/api/TAPI";
import type { IGroup } from "../../data/project/TGroups";

//--------------------------------------------------
//                      SHARED
//--------------------------------------------------
const groupChecker: TAPIChecker = {
	uid: {
		type: "string",
	},
	name: {
		type: "string",
	},
	icon: {
		type: "string",
	},
	color: {
		type: "string",
	},
	count: {
		type: "number",
		optional: true,
	},
};

//--------------------------------------------------
//                      SEND
//--------------------------------------------------
export type TAPIGroupEdit = Partial<Omit<IGroup, "uid" | "count">>;
export const TAPIGroupEditChecker: TAPIChecker = {
	name: {
		...groupChecker.name,
		optional: true,
	},
	icon: {
		...groupChecker.icon,
		optional: true,
	},
	color: {
		...groupChecker.color,
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
		checker: groupChecker,
	},
};

export interface IAPIGroups {
	groups: IGroup[];
}

export const IAPIGroupsChecker: TAPIChecker = {
	groups: {
		type: "array",
		checker: groupChecker,
	},
};
