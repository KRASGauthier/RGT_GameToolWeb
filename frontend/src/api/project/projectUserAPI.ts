import { generatePath } from "react-router";
import { apiCheckReponse, apiPostData } from "../../../rgt/api/shared";
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
	type IAPIProjectUserChangeGroup,
	type IAPIProjectUserRcv,
} from "../../types/api/project/TAPIProjectUser";
import type { IProjectUser } from "../../types/data/project/TProjectUser";

//--------------------------------------------------
//                    GROUP
//--------------------------------------------------
export const apiProjectUserSetGroup = async (
	uid: TUID,
	target: TUID,
	groups: TUID[],
	push: (notif: IAppNotif) => void,
): Promise<IProjectUser | undefined> => {
	const data: IAPIData<IAPIProjectUserRcv> = await apiPostData<
		IAPIProjectUserChangeGroup,
		IAPIProjectUserRcv
	>(
		generatePath(
			API_PROJECT + API_PROJECT_TARGET + API_PROJECT_USER + API_PROJECT_USER_TARGET + API_PROJECT_USER_GROUPS,
			{ uid, projectuser: target },
		),
		{ groups },
		"notif",
	);
	if (!apiCheckReponse(data, IAPIProjectUserRcvChecker, { type: "notif", handler: push })) return;
	return data.data?.projectUser;
};
