import type { TAPIChecker } from "../../../../rgt/types/api/TAPI.js";
import type { ITodo } from "../../data/project/TTodo.js";
import { KTodoChecker } from "./TAPISharedCheckers.js";

//--------------------------------------------------
//                     RCV
//--------------------------------------------------
export interface IAPITodoRcvAll {
	todos: ITodo[];
}

export const IAPITodoRcvAllChecker: TAPIChecker = {
	todos: {
		type: "array",
		checker: KTodoChecker,
	},
};