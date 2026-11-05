import type { TAPIChecker } from "../../../../rgt/types/api/TAPI";
import type { ITodo } from "../../data/project/TTodo";
import { KTodoChecker } from "./TAPISharedCheckers";

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