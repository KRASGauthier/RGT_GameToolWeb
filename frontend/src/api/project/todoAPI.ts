import { apiCheckReponse, apiGetData, apiPostData } from "../../../rgt/api/shared";
import type { IAPIData } from "../../../rgt/types/api/TAPI";
import type { IAppNotif } from "../../../rgt/types/TEvents";
import { API_TODO } from "../../consts";
import { IAPITodoChecker, IAPITodosChecker, type IAPITodo, type IAPITodoDefault, type IAPITodos } from "../../types/api/project/TAPITodo";
import type { ITodo } from "../../types/data/project/TTodo";

//--------------------------------------------------
//                      SAHRED
//--------------------------------------------------
const parseTodo = (data: IAPIData<IAPITodo>): ITodo | undefined => {
	if (!data.data) return;
	if (typeof data.data.todo.date == "string")
		data.data.todo.date = new Date(data.data.todo.date);
	return data.data.todo;
}
const parseTodos = (data: IAPIData<IAPITodos>): ITodo[] | undefined => {
	if (!data.data) return;
	(data.data.todos.forEach((todo: ITodo) => {
	if (typeof todo.date == "string")
		todo.date = new Date(todo.date);
	}))
	return data.data.todos;
}


//--------------------------------------------------
//                      ACCESS
//--------------------------------------------------
export const apiTodoGet = async(
	project: string,
	push: (notif: IAppNotif) => void
): Promise<ITodo[]> => {
	const data: IAPIData<IAPITodos> = await apiGetData<IAPITodos>(API_TODO, "notif", undefined, { project });
	if(!apiCheckReponse(data, IAPITodosChecker, {type: "notif", handler: push})) return [];
	return parseTodos(data) ?? [];
}

//--------------------------------------------------
//                      MANAGE
//--------------------------------------------------
export const apiTodoCreate = async(
	project: string,
	push: (notif: IAppNotif) => void
): Promise<ITodo | undefined> => {
	const data: IAPIData<IAPITodo> = await apiPostData<IAPITodoDefault, IAPITodo>(API_TODO, { project }, "notif");
	if(!apiCheckReponse(data, IAPITodoChecker, {type: "notif", handler: push})) return;
	return parseTodo(data);
}