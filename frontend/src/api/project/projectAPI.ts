import { apiCheckReponse, apiPostData } from "../../../rgt/api/shared";
import type { IAPIData } from "../../../rgt/types/api/TAPI";
import type { IAppNotif } from "../../../rgt/types/TEvents";
import { API_PROJECT } from "../../consts";
import type { IAPIProjectCreate, TAPIProjectCreate } from "../../types/api/project/TAPIProject";

export const apiProjectCreate = async (
	dataIn: TAPIProjectCreate,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPIProjectCreate> = await apiPostData<TAPIProjectCreate, IAPIProjectCreate>(API_PROJECT, dataIn, "notif");
	if(!apiCheckReponse(data, "project", {type: "notif", handler: push})) return;
}