import type { TAPIChecker } from "../../../../rgt/types/api/TAPI.js";
import type { ITodo } from "../../data/project/TTodo.js";

//--------------------------------------------------
//                     SHARED
//--------------------------------------------------
const todoChecker: TAPIChecker = {
	uid: {
		type: "string",
	},
	project: {
		type: "string",
	},
	users: {
		type: "array",
		checker: {
			value: {
				type: "string",
			},
		},
	},
	name: {
		type: "string",
	},
	desc: {
		type: "string",
	},
	date: {
		type: "string",
	},
	tags: {
		type: "array",
		checker: {
			value: {
				type: "string",
			},
		},
	},
	importance: {
		type: "number",
	},
	difficulty: {
		type: "number",
	},
};

//--------------------------------------------------
//                     SEND
//--------------------------------------------------
export interface IAPITodoDefault {
	project: string;
}
export const IAPITodoDefaultChecker: TAPIChecker = {
	project: {
		type: "string",
	},
};

//--------------------------------------------------
//                    RECEIVE
//--------------------------------------------------
export interface IAPITodo {
	todo: ITodo;
}
export const IAPITodoChecker: TAPIChecker = {
	todo: {
		type: "checker",
		checker: todoChecker,
	},
};

export interface IAPITodos {
	todos: ITodo[];
}
export const IAPITodosChecker: TAPIChecker = {
	todos: {
		type: "array",
		checker: todoChecker,
	},
};