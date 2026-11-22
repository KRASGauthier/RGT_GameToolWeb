import axios from "axios";
import { API_BASE, API_BASE_SIMPLE } from "../../src/consts";
import {
	type IAPICheckInfo,
	type IAPIData,
	type IAPIErrors,
	type TAPIChecker,
	type TAPICheckInfoTypes,
} from "../types/api/TAPI";
import { apiMakeError } from "./errors";
import type { IErrorReturnOptions, TErrorReturn, TErrorReturnTypes } from "../types/TError";
import type { IAppNotif } from "../types/TEvents";

export const api = axios.create({
	baseURL: API_BASE,
	withCredentials: true,
});

//--------------------------------------------------
//                      ERROR
//--------------------------------------------------
function checkApiType(key: string, data: Record<string, unknown>, info: IAPICheckInfo) {
	if (!(key in data) && !info.optional) throw `Missing field: ${key}`;
	if (!(key in data) && info.optional) return;
	if (Array.isArray(data[key])) throw `Unexpected array at key: ${key}`;
	else if (info.type != "checker" && info.type != "date" && typeof data[key] != info.type)
		throw `Wrong field type: ${key} (got: ${typeof data[key]}, expected: ${info.type})`;
	else if (info.type == "date") {
		if (typeof data[key] == "string" && Number.isNaN(new Date(data[key]).getTime()))
			throw `Wrong date enry: '${data[key]}'`;
		else if (
			(typeof data[key] == "object" && !(data[key] instanceof Date)) ||
			(typeof data[key] != "object" && typeof data[key] != "string") ||
			(data[key] instanceof Date && Number.isNaN(new Date(data[key]).getTime()))
		)
			throw `Wrong field type: ${key} (got: ${typeof data[key]}(not a date), expected: Date)`;

		if (typeof data[key] == "string") data[key] = new Date(data[key]);
	}
}
function checkApiTypeArray(value: unknown, type: TAPICheckInfoTypes, index: number, key: string) {
	if (Array.isArray(value)) throw `Unexpected array at index: ${index}`;
	else if (type != "checker" && type != "date" && typeof value != type)
		throw `Wrong field type  at ${index} for ${key} (got: ${typeof value}, expected: ${type})`;
	else if (type == "date") {
		if (typeof value == "string" && Number.isNaN(new Date(value).getTime()))
			throw `Wrong date enty: '${value}'`;
		else if (
			(typeof value == "object" && !(value instanceof Date)) ||
			(typeof value != "object" && typeof value != "string") ||
			(value instanceof Date && Number.isNaN(new Date(value).getTime()))
		)
			throw `Wrong field type at ${index} for ${key} (got: ${typeof value}(not a date), expected: Date)`;
	}
}
export function checkApi(data: Record<string, unknown>, checker: TAPIChecker) {
	for (const [key] of Object.entries(data)) {
		if (!(key in checker)) throw `Unexpected field: ${key}`;
	}

	for (const [key, value] of Object.entries(checker)) {
		if (value.isArray && Array.isArray(data[key])) {
			for (const [index, subValue] of data[key].entries()) {
				if (
					value.type == "checker" &&
					value.checker &&
					typeof subValue == "object" &&
					subValue != null &&
					!Array.isArray(subValue)
				)
					checkApi(subValue, value.checker);
				else if (value.type == "checker")
					throw `Wrong field type at ${index} for ${key} (expected: object)`;
				else checkApiTypeArray(subValue, value.type, index, key);
			}
		} else if (value.isArray && !Array.isArray(data[key])&& !(data[key] == undefined && value.optional))
			throw `Wrong field type: ${key} (got: ${typeof data[key]}, expected: Array)`;
		else if (
			value.type == "checker" &&
			value.checker &&
			typeof data[key] == "object" &&
			data[key] != null &&
			!Array.isArray(data[key])
		) {
			checkApi(data[key] as Record<string, unknown>, value.checker);
		} else if (value.type == "checker" && key in data)
			throw `Wrong field type: ${key} (expected: object)`;
		else checkApiType(key, data, value);
	}
}

export const apiCheckReponse = <_T extends object>(
	data: IAPIData<_T>,
	target: keyof _T | TAPIChecker,
	errorCallback: TErrorReturn,
): data is IAPIData<_T> & { data: _T } => {
	//GLOBAL
	if (data.error) {
		if (errorCallback.type == "error") errorCallback.handler(data.error);
		else
			errorCallback.handler({
				severity: "error",
				message: data.error,
			});
		return false;
	}
	if (!data.data) {
		const error: IAPIData<_T> = apiMakeError(
			-1,
			{ error: ["No data collected"] },
			errorCallback.type,
		);
		if (errorCallback.type == "error") errorCallback.handler(error.error);
		else
			errorCallback.handler({
				severity: "error",
				message: error.error,
			});
		return false;
	}

	//TARGETED
	if (typeof target == "string") {
		if (!(target in data.data)) {
			const error: IAPIData<_T> = apiMakeError(
				-1,
				{ error: ["Data doesn't contain the field: " + target.toString()] },
				errorCallback.type,
			);
			if (errorCallback.type == "error") errorCallback.handler(error.error);
			else
				errorCallback.handler({
					severity: "error",
					message: error.error,
				});
			return false;
		}
	} else if (typeof target == "object") {
		try {
			checkApi(data.data as Record<string, unknown>, target);
		} catch (res) {
			if (typeof res == "string") {
				const error: IAPIData<_T> = apiMakeError(-2, { error: [res] }, errorCallback.type);
				if (errorCallback.type == "error") errorCallback.handler(error.error);
				else
					errorCallback.handler({
						severity: "error",
						message: error.error,
					});
				return false;
			}
			throw res;
		}
	}

	return true;
};
export const apiCheckReponseError = <_T extends object>(
	data: IAPIData<_T>,
	errorCallback: TErrorReturn,
): boolean => {
	if (data.error) {
		if (errorCallback.type == "error") errorCallback.handler(data.error);
		else
			errorCallback.handler({
				severity: "error",
				message: data.error,
			});

		return false;
	}
	return true;
};

//--------------------------------------------------
//                       HTTP
//--------------------------------------------------
export const apiGetData = async <_T>(
	path: string,
	type?: TErrorReturnTypes,
	options?: IErrorReturnOptions,
): Promise<IAPIData<_T>> => {
	try {
		const response = await api.get<_T>(API_BASE_SIMPLE + path);
		return { status: response.status, data: response.data };
	} catch (e: unknown) {
		if (axios.isAxiosError<IAPIErrors>(e))
			return { ...apiMakeError(e.response?.status, e.response?.data, type, options) };
		return { ...apiMakeError(undefined, undefined, type, options) };
	}
};

export const apiPostData = async <_Req, _Res>(
	path: string,
	request: _Req,
	type?: TErrorReturnTypes,
	options?: IErrorReturnOptions,
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.post<_Res>(API_BASE_SIMPLE + path, request);
		return { status: response.status, data: response.data };
	} catch (e: unknown) {
		if (axios.isAxiosError<IAPIErrors>(e))
			return { ...apiMakeError(e.response?.status, e.response?.data, type, options) };
		return { ...apiMakeError(undefined, undefined, type, options) };
	}
};

export const apiPutData = async <_Req, _Res>(
	path: string,
	request: _Req,
	type?: TErrorReturnTypes,
	options?: IErrorReturnOptions,
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.put<_Res>(API_BASE_SIMPLE + path, request);
		return { status: response.status, data: response.data };
	} catch (e: unknown) {
		if (axios.isAxiosError<IAPIErrors>(e))
			return { ...apiMakeError(e.response?.status, e.response?.data, type, options) };
		return { ...apiMakeError(undefined, undefined, type, options) };
	}
};

export const apiPatchData = async <_Req, _Res>(
	path: string,
	request: _Req,
	type?: TErrorReturnTypes,
	options?: IErrorReturnOptions,
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.patch<_Res>(API_BASE_SIMPLE + path, request);
		return { status: response.status, data: response.data };
	} catch (e: unknown) {
		if (axios.isAxiosError<IAPIErrors>(e))
			return { ...apiMakeError(e.response?.status, e.response?.data, type, options) };
		return { ...apiMakeError(undefined, undefined, type, options) };
	}
};

export const apiDeleteData = async <_Req, _Res>(
	path: string,
	request: _Req,
	type?: TErrorReturnTypes,
	options?: IErrorReturnOptions,
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.delete<_Res>(API_BASE_SIMPLE + path, { data: request });
		return { status: response.status, data: response.data };
	} catch (e: unknown) {
		if (axios.isAxiosError<IAPIErrors>(e))
			return { ...apiMakeError(e.response?.status, e.response?.data, type, options) };
		return { ...apiMakeError(undefined, undefined, type, options) };
	}
};

//--------------------------------------------------
//                      BLOB
//--------------------------------------------------
export const apiGetImageBlob = async (
	path: string,
	push: (notif: IAppNotif) => void,
): Promise<Blob | undefined> => {
	try {
		const data = await api.get(path, {
			responseType: "blob",
		});
		if (!data.data) throw {};
		return data.data as Blob;
	} catch {
		push({
			severity: "error",
			message: `Failed to load: ${path}`,
		});
	}
};
