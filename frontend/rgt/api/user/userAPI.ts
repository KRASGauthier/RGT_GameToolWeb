import { API_USER, API_USER_CHECK_AVAILABLE, API_USER_SELF } from "../../consts";
import type { IAPIData, TErrorInfo } from "../../types/api/TAPI";
import type {
	IAPIUserCheckAvailable,
	IAPIUserCheckAvailableRcv,
	IAPIUserGetSelfFull,
	IAPIUserRegister,
} from "../../types/api/users/TAPIUsers";
import type { IUserFull, IUserRegister } from "../../types/data/TUser";
import type { IAppNotif } from "../../types/TEvents";
import { apiCheckReponse, apiCheckReponseError, apiGetData, apiPostData } from "../shared";

//--------------------------------------------------
//                   REGISTERING
//--------------------------------------------------
export const apiUserRegister = async (
	user: IUserRegister,
	push: (notif: IAppNotif) => void,
	onErrorInfo: (info: TErrorInfo) => void,
): Promise<boolean> => {
	const data: IAPIData<{}> = await apiPostData<IAPIUserRegister, {}>(API_USER, { user }, "notif");
	if (!apiCheckReponseError(data, { type: "notif", handler: push })) {
		if (data.errorInfo) onErrorInfo(data.errorInfo);
		return false;
	}
	return true;
};

export const apiUserCheckAvailable = async (
	username: string,
	push: (notif: IAppNotif) => void,
): Promise<boolean> => {
	const data: IAPIData<IAPIUserCheckAvailableRcv> = await apiPostData<
		IAPIUserCheckAvailable,
		IAPIUserCheckAvailableRcv
	>(API_USER + API_USER_CHECK_AVAILABLE, { username }, "notif");
	if (!apiCheckReponse(data, "available", { type: "notif", handler: push })) return false;
	if (!data.data) return false;
	return data.data.available;
};

//--------------------------------------------------
//                      INFOS
//--------------------------------------------------
export const apiUserGetFullSelf = async (
	setUser: React.Dispatch<React.SetStateAction<IUserFull | undefined>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPIUserGetSelfFull> = await apiGetData<IAPIUserGetSelfFull>(
		API_USER + API_USER_SELF,
		"notif",
	);
	if (!apiCheckReponse(data, "user", { type: "notif", handler: push })) return false;
	if (!data.data) return false;
	setUser(data.data.user);
};
