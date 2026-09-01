import type { TAPIChecker } from "../../../../rgt/types/api/TAPI.js";
import type { IProject } from "../../data/project/TProject.js";

//--------------------------------------------------
//                     SEND
//--------------------------------------------------
export type TAPIProjectCreate = Omit<IProject, "uid" | "owner">
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
	project: IProject
}