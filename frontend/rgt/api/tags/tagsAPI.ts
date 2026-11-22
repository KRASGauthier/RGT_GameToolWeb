import { generatePath } from "react-router";
import { API_TAG_GLOBAL_ID } from "../../consts";
import {
	IAPITagGetChecker,
	type IAPITagCreate,
	type IAPITagEdit,
	type IAPITagGet,
} from "../../types/api/tags/TAPITags";
import type { IAPIData } from "../../types/api/TAPI";
import type { ITag } from "../../types/data/TTag";
import type { IAppNotif } from "../../types/TEvents";
import { apiCheckReponse, apiGetData, apiPostData } from "../shared";

//--------------------------------------------------
//                     MANAGE
//--------------------------------------------------
export const apiTagGet = async (
	path: string,
	setTags: React.Dispatch<React.SetStateAction<ITag[]>>,
	push: (notif: IAppNotif) => void,
) => {
	const data: IAPIData<IAPITagGet> = await apiGetData<IAPITagGet>(path, "notif");
	if (!apiCheckReponse(data, IAPITagGetChecker, { type: "notif", handler: push })) return [];
	setTags(data.data.tags);
};

//--------------------------------------------------
//                     MANAGE
//--------------------------------------------------
export const apiTagsAdd = async (
	path: string,
	tag: Partial<ITag>,
	setTags: React.Dispatch<React.SetStateAction<ITag[]>>,
	push: (notif: IAppNotif) => void,
): Promise<boolean> => {
	const data: IAPIData<IAPITagGet> = await apiPostData<IAPITagCreate, IAPITagGet>(
		path,
		{ tag },
		"notif",
	);
	if (!apiCheckReponse(data, IAPITagGetChecker, { type: "notif", handler: push })) return false;
	setTags(data.data.tags);
	return true;
};

export const apiTagsEdit = async (
	path: string,
	tag: ITag,
	setTags: React.Dispatch<React.SetStateAction<ITag[]>>,
	push: (notif: IAppNotif) => void,
): Promise<boolean> => {
	const data: IAPIData<IAPITagGet> = await apiPostData<IAPITagEdit, IAPITagGet>(
		generatePath(path + API_TAG_GLOBAL_ID, { tag: tag.uid }),
		{ tag },
		"notif",
	);
	if (!apiCheckReponse(data, IAPITagGetChecker, { type: "notif", handler: push })) return false;
	setTags(data.data.tags);
	return true;
};
