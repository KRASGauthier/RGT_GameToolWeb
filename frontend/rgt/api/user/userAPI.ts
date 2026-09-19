import {
	API_USER,
	API_USER_CHECK_AVAILABLE,
	API_USER_SELF_PASSWORD,
	API_USER_SELF,
	API_USER_SELF_AVATAR,
	API_USER_REGISTER,
} from "../../consts";
import type { IAPIData, TErrorInfo } from "../../types/api/TAPI";
import {
	IAPIUserListChecker,
	type IAPIUserSearch,
	type IAPIChangePassword,
	type IAPIUserCheckAvailable,
	type IAPIUserCheckAvailableRcv,
	type IAPIUserGetSelfFull,
	type IAPIUserList,
	type IAPIUserPatchSelf,
	type IAPIUserRegister,
} from "../../types/api/users/TAPIUsers";
import type { IUserBase, IUserFull, IUserRegister } from "../../types/data/TUser";
import type { IAppNotif } from "../../types/TEvents";
import {
	apiCheckReponse,
	apiCheckReponseError,
	apiGetData,
	apiPatchData,
	apiPostData,
} from "../shared";

//--------------------------------------------------
//                   ACCESS
//--------------------------------------------------
//--------------------- SHARED ---------------------
export const apiUserGetUserSearch = async (
	search: string,
	push: (notif: IAppNotif) => void,
): Promise<IUserBase[]> => {
	const data: IAPIData<IAPIUserList> = await apiPostData<IAPIUserSearch, IAPIUserList>(
		API_USER,
		{ search },
		"notif",
	);
	if (!apiCheckReponse(data, IAPIUserListChecker, { type: "notif", handler: push })) return [];
	return data.data?.users ?? [];
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

//--------------------- SELF ---------------------
export const apiUserGetSelf = async (
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

//--------------------------------------------------
//                      MANAGE
//--------------------------------------------------
export const apiUserRegister = async (
	user: IUserRegister,
	push: (notif: IAppNotif) => void,
	onErrorInfo: (info: TErrorInfo) => void,
): Promise<boolean> => {
	const data: IAPIData<{}> = await apiPostData<IAPIUserRegister, {}>(
		API_USER + API_USER_REGISTER,
		{ user },
		"notif",
	);
	if (!apiCheckReponseError(data, { type: "notif", handler: push })) {
		if (data.errorInfo) onErrorInfo(data.errorInfo);
		return false;
	}
	return true;
};
export const apiUserPatchSelf = async (
	changes: IAPIUserPatchSelf,
	push: (notif: IAppNotif) => void,
): Promise<IUserFull | undefined> => {
	const data: IAPIData<IAPIUserGetSelfFull> = await apiPatchData<
		IAPIUserPatchSelf,
		IAPIUserGetSelfFull
	>(API_USER + API_USER_SELF, changes, "notif");
	if (!apiCheckReponse(data, "user", { type: "notif", handler: push })) return undefined;
	if (!data.data) return undefined;
	return data.data.user;
};

export const apiUserUploadAvatar = async (
	file: File,
	setUser: React.Dispatch<React.SetStateAction<IUserFull | undefined>>,
	push: (notif: IAppNotif) => void,
): Promise<IUserFull | undefined> => {
	const formData = new FormData();
	formData.append("avatar", file);
	const data: IAPIData<IAPIUserGetSelfFull> = await apiPatchData<FormData, IAPIUserGetSelfFull>(
		API_USER + API_USER_SELF + API_USER_SELF_AVATAR,
		formData,
		"notif",
	);
	if (!apiCheckReponse(data, "user", { type: "notif", handler: push })) return;
	if (!data.data) return;
	if (data.data.user.avatar) data.data.user.avatar += `?v=${Date.now()}`;
	setUser(data.data.user);
};

export const apiChangePassword = async (
	currentPassword: string,
	newPassword: string,
	push: (notif: IAppNotif) => void,
): Promise<boolean> => {
	const data: IAPIData<{ message: string }> = await apiPatchData<
		IAPIChangePassword,
		{ message: string }
	>(API_USER + API_USER_SELF + API_USER_SELF_PASSWORD, { currentPassword, newPassword }, "notif");

	if (!apiCheckReponse(data, "message", { type: "notif", handler: push })) return false;
	return true;
};
