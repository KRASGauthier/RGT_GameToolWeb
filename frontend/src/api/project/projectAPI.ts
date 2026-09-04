import { apiCheckReponse, apiGetData, apiPostData } from "../../../rgt/api/shared";
import type { IAPIData } from "../../../rgt/types/api/TAPI";
import type { IAppNotif } from "../../../rgt/types/TEvents";
import { API_PROJECT } from "../../consts";
import {
	IAPIProjectGetFromUserCheck,
	type IAPIProjectCreate,
	type IAPIProjectGetFromUser,
	type TAPIProjectCreate,
} from "../../types/api/project/TAPIProject";
import type { IProject } from "../../types/data/project/TProject";

//--------------------------------------------------
//                       MANAGE
//--------------------------------------------------
export const apiProjectCreate = async (
	dataIn: TAPIProjectCreate,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPIProjectCreate> = await apiPostData<
		TAPIProjectCreate,
		IAPIProjectCreate
	>(API_PROJECT, dataIn, "notif");
	if (!apiCheckReponse(data, "project", { type: "notif", handler: push })) return;
};

//--------------------------------------------------
//                       ACCESS
//--------------------------------------------------
export const apiGetUserProject = async (
	setProjects: React.Dispatch<React.SetStateAction<IProject[]>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPIProjectGetFromUser> = await apiGetData<IAPIProjectGetFromUser>(
		API_PROJECT,
		"notif",
	);
	if (!apiCheckReponse(data, IAPIProjectGetFromUserCheck, { type: "notif", handler: push }))
		return;

	if (!data.data) return;

	data.data.projects.forEach((project: IProject) => {
		if (typeof project.created == "string") project.created = new Date(project.created);
		if (typeof project.lastOpened == "string")
			project.lastOpened = new Date(project.lastOpened);
	});
	setProjects(data.data.projects);
};
