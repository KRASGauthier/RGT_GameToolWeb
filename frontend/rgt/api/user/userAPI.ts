import { API_USER, API_USER_CHECK_AVAILABLE, API_USER_SELF } from "../../consts";
import type { IAPIData, TErrorInfo } from "../../types/api/TAPI";
import type {
	IAPIChangePassword,
	IAPIUserCheckAvailable,
	IAPIUserCheckAvailableRcv,
	IAPIUserGetSelfFull,
	IAPIUserPatchSelf,
	IAPIUserRegister,
} from "../../types/api/users/TAPIUsers";
import type { IUserFull, IUserRegister } from "../../types/data/TUser";
import type { IAppNotif } from "../../types/TEvents";
import { api, apiCheckReponse, apiCheckReponseError, apiGetData, apiPatchData, apiPostData } from "../shared";

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

export const apiUserPatchSelf = async (
	changes: IAPIUserPatchSelf,
	push: (notif: IAppNotif) => void,
): Promise<IUserFull | undefined> => {
	const data: IAPIData<IAPIUserGetSelfFull> = await apiPatchData<IAPIUserPatchSelf, IAPIUserGetSelfFull>(
		API_USER + API_USER_SELF,
		changes,
		"notif",
	);
	if (!apiCheckReponse(data, "user", { type: "notif", handler: push })) return undefined;
	if (!data.data) return undefined;
	return data.data.user;
};

export const apiUserUploadAvatar = async (
	file: File,
	push: (notif: IAppNotif) => void,
): Promise<IUserFull | undefined> => {
	const formData = new FormData();
	formData.append("avatar", file);

	try {
		const response = await api.patch<IAPIUserGetSelfFull>(API_USER + API_USER_SELF + "/avatar", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		const data = response.data;
		if (!data || !data.user) 
			return undefined;

		push({ severity: "success", message: "Avatar updated." });
		return data.user;
	} catch {
		push({ severity: "error", message: "Avatar upload failed." });
		return undefined;
	}
};

export const apiChangePassword = async (
    currentPassword: string,
    newPassword: string,
    push: (notif: IAppNotif) => void,
): Promise<boolean> => {
    const data: IAPIData<{ message: string }> = await apiPatchData<
        IAPIChangePassword,
        { message: string }
    >(
        API_USER + API_USER_SELF + "/password",
        { currentPassword, newPassword },
        "notif",
    );

    if (!apiCheckReponse(data, "message", { type: "notif", handler: push })) return false;
    return true;
};