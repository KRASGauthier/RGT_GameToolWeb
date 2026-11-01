import { generatePath } from "react-router";
import { apiCheckReponse, apiDeleteData, apiPatchData, apiPostData } from "../../../rgt/api/shared";
import type { IAPIData } from "../../../rgt/types/api/TAPI";
import type { IAppNotif } from "../../../rgt/types/TEvents";
import type { TUID } from "../../../rgt/types/TShared";
import {
	API_PROJECT,
	API_PROJECT_TARGET,
	API_PROJECT_USER,
	API_PROJECT_USER_GROUPS,
	API_PROJECT_USER_TARGET,
} from "../../consts";
import {
	IAPIProjectUserRcvChecker,
	IAPIProjectUsersUpdateChecker,
	type IAPIProjectUserAdd,
	type IAPIProjectUserChangeGroup,
	type IAPIProjectUserRcv,
	type IAPIProjectUsersUpdate,
} from "../../types/api/project/TAPIProjectUser";
import type { IProjectUser } from "../../types/data/project/TProjectUser";
import type { IProject } from "../../types/data/project/TProject";

//--------------------------------------------------
//                    MANAGEMENT
//--------------------------------------------------
export const apiProjectUserAdd = async (
	uid: TUID,
	newUser: TUID,
	setProject: React.Dispatch<React.SetStateAction<IProject | undefined>>,
	setUsers: React.Dispatch<React.SetStateAction<IProjectUser[]>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPIProjectUsersUpdate> = await apiPostData<
		IAPIProjectUserAdd,
		IAPIProjectUsersUpdate
	>(
		generatePath(API_PROJECT + API_PROJECT_TARGET + API_PROJECT_USER, { uid }),
		{ user: newUser },
		"notif",
	);
	if (!apiCheckReponse(data, IAPIProjectUsersUpdateChecker, { type: "notif", handler: push }))
		return;

	setProject(data.data.project);
	setUsers(data.data.users);
};

export const apiProjectUserRemove = async (
	uid: TUID,
	target: TUID,
	setProject: React.Dispatch<React.SetStateAction<IProject | undefined>>,
	setUsers: React.Dispatch<React.SetStateAction<IProjectUser[]>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPIProjectUsersUpdate> = await apiDeleteData<{}, IAPIProjectUsersUpdate>(
		generatePath(
			API_PROJECT + API_PROJECT_TARGET + API_PROJECT_USER + API_PROJECT_USER_TARGET,
			{ uid, projectuser: target },
		),
		{},
		"notif",
	);
	if (!apiCheckReponse(data, IAPIProjectUsersUpdateChecker, { type: "notif", handler: push }))
		return;

	setProject(data.data.project);
	setUsers(data.data.users);
};

//--------------------------------------------------
//                    GROUP
//--------------------------------------------------
export const apiProjectUserSetGroup = async (
	uid: TUID,
	target: TUID,
	groups: TUID[],
	push: (notif: IAppNotif) => void,
): Promise<IProjectUser | undefined> => {
	const data: IAPIData<IAPIProjectUserRcv> = await apiPatchData<
		IAPIProjectUserChangeGroup,
		IAPIProjectUserRcv
	>(
		generatePath(
			API_PROJECT +
				API_PROJECT_TARGET +
				API_PROJECT_USER +
				API_PROJECT_USER_TARGET +
				API_PROJECT_USER_GROUPS,
			{ uid, projectuser: target },
		),
		{ groups },
		"notif",
	);
	if (!apiCheckReponse(data, IAPIProjectUserRcvChecker, { type: "notif", handler: push })) return;
	return data.data?.projectUser;
};
