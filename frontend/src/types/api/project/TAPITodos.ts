import type { TAPIChecker } from "../../../../rgt/types/api/TAPI";
import { apiMakePartial } from "../../../../rgt/util/UApi";
import type { ITodo, TTodoState } from "../../data/project/TTodo";

//--------------------------------------------------
//                      SHARED
//--------------------------------------------------
export const todoChecker: TAPIChecker = {
	uid: {
		type: "string",
	},
	project: {
		type: "string",
	},
	name: {
		type: "string",
	},
	desc: {
		type: "string",
	},
	date: {
		type: "date",
	},
	users: {
		type: "string",
		isArray: true,
	},
	groups: {
		type: "string",
		isArray: true,
	},
	tags: {
		type: "string",
		isArray: true,
	},
	importance: {
		type: "number",
	},
	difficulty: {
		type: "number",
	},
	state: {
		type: "string",
	},
	new: {
		type: "boolean",
		optional: true,
	},
};


//--------------------------------------------------
//                     SEND
//--------------------------------------------------
export interface IAPITodoEdit {
	todo: Partial<Omit<ITodo, "uid" | "project" | "new" | "state">>;
}

export const IAPITodoEditChecker: TAPIChecker = {
	todo: {
		type: "checker",
		checker: apiMakePartial(todoChecker, ["uid", "project", "new", "state"]),
	},
};

export interface IAPITodoSetState {
	state: TTodoState;
}

export const IAPITodoSetStateChecker: TAPIChecker = {
	state: {
		type: "string",
	},
};



//--------------------------------------------------
//                     RCV
//--------------------------------------------------
export interface IAPITodoRcvAll {
	todos: ITodo[];
}

export const IAPITodoRcvAllChecker: TAPIChecker = {
	todos: {
		type: "checker",
		isArray: true,
		checker: todoChecker,
	},
};
