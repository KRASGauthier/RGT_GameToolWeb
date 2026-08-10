import { API_USER, API_USER_CHECK_AVAILABLE } from "../../consts";
import type { IAPIData, TErrorInfo } from "../../types/api/TAPI";
import type {
	IAPIUserCheckAvailable,
	IAPIUserCheckAvailableRcv,
	IAPIUserRegister,
} from "../../types/api/users/TAPIUsers";
import type { IUserRegister } from "../../types/data/TUser";
import type { IAppNotif } from "../../types/TEvents";
import { apiCheckReponse, apiCheckReponseError, apiPostData } from "../shared";

export const apiUserRegister = async (
	user: IUserRegister,
	push: (notif: IAppNotif) => void,
	onErrorInfo: (info: TErrorInfo) => void,
) => {
	const data: IAPIData<{}> = await apiPostData<IAPIUserRegister, {}>(API_USER, { user }, "notif");
	if (!apiCheckReponseError(data, { type: "notif", handler: push })) {
		if (data.errorInfo) onErrorInfo(data.errorInfo);
		return;
	}
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
