import type { TAPIChecker } from "../../../../rgt/types/api/TAPI";
import type { IProject } from "../../data/project/TProject";

//--------------------------------------------------
//                     SEND
//--------------------------------------------------
export type TAPIProjectCreate = Omit<
	IProject,
	"uid" | "owner" | "ownerName" | "created" | "lastOpened"
>;
export const TAPIProjectCreateChecker: TAPIChecker = {
	name: {
		type: "string",
	},
	title: {
		type: "string",
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
};

//--------------------------------------------------
//                     RECIEVE
//--------------------------------------------------
export interface IAPIProjectCreate {
	project: IProject;
}

export interface IAPIProjectGetFromUser {
	projects: IProject[];
}
export const IAPIProjectGetFromUserCheck: TAPIChecker = {
	projects: {
		type: "array",
		checker: {
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
		},
	},
};
