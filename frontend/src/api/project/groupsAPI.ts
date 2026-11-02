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
import { API_GROUPS, API_GROUPS_TARGET, API_PROJECT, API_PROJECT_TARGET } from "../../consts";
import {
	IAPIGroupChecker,
	IAPIGroupsChecker,
	IAPIGroupsDeleteChecker,
	type IAPIGroup,
	type IAPIGroups,
	type IAPIGroupsDelete,
	type TAPIGroupEdit,
} from "../../types/api/project/TAPIGroups";
import type { IGroup } from "../../types/data/project/TGroups";
import type { IProjectUser } from "../../types/data/project/TProjectUser";

//--------------------------------------------------
//                      ACCESS
//--------------------------------------------------
export const apiGroupGet = async (
	project: string,
	push: (notif: IAppNotif) => void,
): Promise<IGroup[]> => {
	const data: IAPIData<IAPIGroups> = await apiGetData<IAPIGroups>(
		generatePath(API_PROJECT + API_PROJECT_TARGET + API_GROUPS, { uid: project }),
		"notif",
	);
	if (!apiCheckReponse(data, IAPIGroupsChecker, { type: "notif", handler: push })) return [];
	return data.data?.groups ?? [];
};

//--------------------------------------------------
//                       MANAGE
//--------------------------------------------------
export const apiGroupCreate = async (
	project: string,
	push: (notif: IAppNotif) => void,
): Promise<IGroup | undefined> => {
	const data: IAPIData<IAPIGroup> = await apiPostData<{}, IAPIGroup>(
		generatePath(API_PROJECT + API_PROJECT_TARGET + API_GROUPS, { uid: project }),
		{},
		"notif",
	);
	if (!apiCheckReponse(data, IAPIGroupChecker, { type: "notif", handler: push })) return;
	return data.data?.group;
};

export const apiGroupModify = async (
	project: string,
	target: string,
	edit: TAPIGroupEdit,
	push: (notif: IAppNotif) => void,
): Promise<IGroup[] | boolean> => {
	const data: IAPIData<IAPIGroups> = await apiPatchData<TAPIGroupEdit, IAPIGroups>(
		generatePath(API_PROJECT + API_PROJECT_TARGET + API_GROUPS + API_GROUPS_TARGET, {
			uid: project,
			group: target,
		}),
		edit,
		"notif",
	);
	if (!apiCheckReponse(data, IAPIGroupsChecker, { type: "notif", handler: push })) return false;
	return data.data?.groups ?? false;
};

export const apiGroupDelete = async (
	project: string,
	target: string,
	setUsers: React.Dispatch<React.SetStateAction<IProjectUser[]>>,
	setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPIGroupsDelete> = await apiDeleteData<{}, IAPIGroupsDelete>(
		generatePath(API_PROJECT + API_PROJECT_TARGET + API_GROUPS + API_GROUPS_TARGET, {
			uid: project,
			group: target,
		}),
		{},
		"notif",
	);
	if (!apiCheckReponse(data, IAPIGroupsDeleteChecker, { type: "notif", handler: push })) {
		setUsers([]);
		setGroups([]);
		return;
	}
	setUsers(data.data.users);
	setGroups(data.data.groups);
};
