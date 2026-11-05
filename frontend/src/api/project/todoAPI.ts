import { generatePath } from "react-router";
import { apiCheckReponse, apiPostData } from "../../../rgt/api/shared";
import type { IAPIData } from "../../../rgt/types/api/TAPI";
import type { IAppNotif } from "../../../rgt/types/TEvents";
import type { TUID } from "../../../rgt/types/TShared";
import { API_PROJECT, API_PROJECT_TARGET, API_PROJECT_TODO } from "../../consts";
import { IAPITodoRcvAllChecker, type IAPITodoRcvAll } from "../../types/api/project/TAPITodos";
import type { ITodo } from "../../types/data/project/TTodo";

//--------------------------------------------------
//                      MANAGE
//--------------------------------------------------
export const apiTodoAdd = async (
	uid: TUID,
	setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPITodoRcvAll> = await apiPostData<
		{},
		IAPITodoRcvAll
	>(
		generatePath(API_PROJECT + API_PROJECT_TARGET + API_PROJECT_TODO, { uid }),
		{},
		"notif",
	);
	if (!apiCheckReponse(data, IAPITodoRcvAllChecker, { type: "notif", handler: push }))
		return;

	setTodos(data.data.todos);
};