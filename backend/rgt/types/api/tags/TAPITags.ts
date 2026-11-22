import type { ITag } from "../../data/TTag.js";
import type { TAPIChecker } from "../TAPI.js";

//--------------------------------------------------
//                      SHARED
//--------------------------------------------------
export const tagChecker: TAPIChecker = {
	uid: { type: "string" },
	name: { type: "string" },
	icon: { type: "string" },
	color: { type: "string" },
};

//--------------------------------------------------
//                       SEND
//--------------------------------------------------
export interface IAPITagCreate {
	tag: Partial<ITag>;
}

export const IAPITagCreateChecker: TAPIChecker = {
	tag: {
		type: "checker",
		checker: {
			name: { type: "string" },
			icon: { type: "string", optional: true },
			color: { type: "string", optional: true },
		},
	},
};

export interface IAPITagEdit {
	tag: ITag;
}

export const IAPITagEditChecker: TAPIChecker = {
	tag: {
		type: "checker",
		checker: tagChecker,
	},
};

//--------------------------------------------------
//                       RCV
//--------------------------------------------------
export interface IAPITagGet {
	tags: ITag[];
}

export const IAPITagGetChecker: TAPIChecker = {
	tags: {
		type: "checker",
		isArray: true,
		checker: tagChecker,
	},
};
