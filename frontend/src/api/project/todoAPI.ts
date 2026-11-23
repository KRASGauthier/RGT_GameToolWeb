import { generatePath } from "react-router";
import {
	apiCheckReponse,
	apiDeleteData,
	apiGetData,
	apiPatchData,
	apiPostData,
} from "../../../rgt/api/shared";
import type { IAPIData } from "../../../rgt/types/api/TAPI";
import type { IAppNotif } from "../../../rgt/types/TEvents";
import type { TUID } from "../../../rgt/types/TShared";
import {
	API_PROJECT,
	API_PROJECT_TARGET,
	API_PROJECT_TODO,
	API_PROJECT_TODO_STATE,
	API_PROJECT_TODO_TARGET,
} from "../../consts";
import {
	type IAPITodoEdit,
	IAPITodoRcvAllChecker,
	type IAPITodoRcvAll,
	type IAPITodoSetState,
} from "../../types/api/project/TAPITodos";
import type { ITodo, TTodoState } from "../../types/data/project/TTodo";

//--------------------------------------------------
//                      ACCESS
//--------------------------------------------------
export const apiTodoGet = async (
	uid: TUID,
	setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPITodoRcvAll> = await apiGetData<IAPITodoRcvAll>(
		generatePath(API_PROJECT + API_PROJECT_TARGET + API_PROJECT_TODO, { uid }),
		"notif",
	);
	if (!apiCheckReponse(data, IAPITodoRcvAllChecker, { type: "notif", handler: push })) return;

	setTodos(data.data.todos);
};

//--------------------------------------------------
//                      MANAGE
//--------------------------------------------------
export const apiTodoAdd = async (
	uid: TUID,
	setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPITodoRcvAll> = await apiPostData<{}, IAPITodoRcvAll>(
		generatePath(API_PROJECT + API_PROJECT_TARGET + API_PROJECT_TODO, { uid }),
		{},
		"notif",
	);
	if (!apiCheckReponse(data, IAPITodoRcvAllChecker, { type: "notif", handler: push })) return;

	setTodos(data.data.todos);
};

export const apiTodoEdit = async (
	uid: TUID,
	todoUID: TUID,
	todo: Partial<ITodo>,
	setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>,
	push: (notif: IAppNotif) => void,
): Promise<boolean> => {
	const data: IAPIData<IAPITodoRcvAll> = await apiPatchData<IAPITodoEdit, IAPITodoRcvAll>(
		generatePath(
			API_PROJECT + API_PROJECT_TARGET + API_PROJECT_TODO + API_PROJECT_TODO_TARGET,
			{ uid, todo: todoUID },
		),
		{ todo },
		"notif",
	);
	if (!apiCheckReponse(data, IAPITodoRcvAllChecker, { type: "notif", handler: push }))
		return false;

	setTodos(data.data.todos);
	return true;
};

export const apiTodoDelete = async (
	uid: TUID,
	todoUID: TUID,
	setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPITodoRcvAll> = await apiDeleteData<{}, IAPITodoRcvAll>(
		generatePath(
			API_PROJECT + API_PROJECT_TARGET + API_PROJECT_TODO + API_PROJECT_TODO_TARGET,
			{ uid, todo: todoUID },
		),
		{},
		"notif",
	);
	if (!apiCheckReponse(data, IAPITodoRcvAllChecker, { type: "notif", handler: push })) return;

	setTodos(data.data.todos);
};

//--------------------------------------------------
//                   ACTIONS
//--------------------------------------------------
export const apiTodoSetState = async (
	uid: TUID,
	todoUID: TUID,
	state: TTodoState,
	setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPITodoRcvAll> = await apiPatchData<IAPITodoSetState, IAPITodoRcvAll>(
		generatePath(
			API_PROJECT +
				API_PROJECT_TARGET +
				API_PROJECT_TODO +
				API_PROJECT_TODO_TARGET +
				API_PROJECT_TODO_STATE,
			{ uid, todo: todoUID },
		),
		{ state },
		"notif",
	);
	if (!apiCheckReponse(data, IAPITodoRcvAllChecker, { type: "notif", handler: push })) return;

	setTodos(data.data.todos);
	return;
};
