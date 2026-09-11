import type { ReactNode } from "react";
import { apiCheckReponse, apiGetData, apiPatchData, apiPostData } from "../../../rgt/api/shared";
import type { IAPIData } from "../../../rgt/types/api/TAPI";
import type { IAppNotif } from "../../../rgt/types/TEvents";
import { API_PROJECT, API_PROJECT_TARGET, API_PROJECT_TARGET_PICTURE } from "../../consts";
import {
	IAPIProjectChecker,
	IAPIProjectGetChecker,
	IAPIProjectGetFromUserChecker,
	type IAPIProject,
	type IAPIProjectGet,
	type IAPIProjectGetFromUser,
	type TAPIProjectCreate,
	type TAPIProjectModify,
} from "../../types/api/project/TAPIProject";
import type { IProject } from "../../types/data/project/TProject";
import { generatePath } from "react-router";

//--------------------------------------------------
//                    SHARED
//--------------------------------------------------
const parseProject = (data: IAPIData<IAPIProject>, fromImage: boolean  = false): IProject | undefined => {
	if (!data.data) return;

	if (typeof data.data.project.created == "string")
		data.data.project.created = new Date(data.data.project.created);
	if (typeof data.data.project.lastOpened == "string")
		data.data.project.lastOpened = new Date(data.data.project.lastOpened);
	if(data.data.project.cover && fromImage)
		data.data.project.cover += `?v=${Date.now()}`

	return data.data.project;
}

//--------------------------------------------------
//                       MANAGE
//--------------------------------------------------
export const apiProjectCreate = async (
	dataIn: TAPIProjectCreate,
	push: (notif: IAppNotif) => void,
): Promise<IProject | undefined> => {
	const data: IAPIData<IAPIProject> = await apiPostData<
		TAPIProjectCreate,
		IAPIProject
	>(API_PROJECT, dataIn, "notif");
	if (!apiCheckReponse(data, "project", { type: "notif", handler: push })) return;
	return parseProject(data);
};

export const apiProjectModify = async (
	uid: string,
	dataIn: TAPIProjectModify,
	push: (notif: IAppNotif) => void,
): Promise<IProject | undefined> => {
	const data: IAPIData<IAPIProject> = await apiPatchData<
		TAPIProjectModify,
		IAPIProject
	>(generatePath(API_PROJECT + API_PROJECT_TARGET, { uid }), dataIn, "notif");
	if (!apiCheckReponse(data, IAPIProjectChecker, { type: "notif", handler: push })) return;
	return parseProject(data);
};

export const apiProjectSetImage = async (
	uid: string,
	file: File,
	push: (notif: IAppNotif) => void,
): Promise<IProject | undefined> => {
	const form = new FormData();
	form.append("picture", file);

	const data: IAPIData<IAPIProject> = await apiPatchData<
		FormData,
		IAPIProject
	>(generatePath(API_PROJECT + API_PROJECT_TARGET + API_PROJECT_TARGET_PICTURE, { uid }), form, "notif");
	if (!apiCheckReponse(data, IAPIProjectChecker, { type: "notif", handler: push })) return;
	return parseProject(data, true);
};


//--------------------------------------------------
//                       ACCESS
//--------------------------------------------------
export const apiGetUserProject = async (
	setProjects: React.Dispatch<React.SetStateAction<IProject[] | undefined>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPIProjectGetFromUser> = await apiGetData<IAPIProjectGetFromUser>(
		API_PROJECT,
		"notif",
	);
	if (!apiCheckReponse(data, IAPIProjectGetFromUserChecker, { type: "notif", handler: push })) {
		setProjects([]);
		return;
	}

	if (!data.data) {
		setProjects([]);
		return;
	}

	data.data.projects.forEach((project: IProject) => {
		if (typeof project.created == "string") project.created = new Date(project.created);
		if (typeof project.lastOpened == "string")
			project.lastOpened = new Date(project.lastOpened);
	});
	setProjects(data.data.projects);
};

export const apiGetProject = async (
	uid: string,
	setProjects: React.Dispatch<React.SetStateAction<IProject | undefined>>,
	setError: React.Dispatch<React.SetStateAction<ReactNode>>,
) => {
	const data: IAPIData<IAPIProjectGet> = await apiGetData<IAPIProjectGet>(
		generatePath(API_PROJECT + API_PROJECT_TARGET, { uid })
	);
	if (!apiCheckReponse(data, IAPIProjectGetChecker, { type: "error", handler: setError})) {
		setProjects(undefined);
		return;
	}
	setProjects(data.data?.project);
};
