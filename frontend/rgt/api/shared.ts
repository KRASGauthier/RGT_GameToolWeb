import axios from "axios";
import { API_BASE, API_BASE_SIMPLE } from "../../src/consts";
import { type IAPIData, type IAPIErrors, type TAPIChecker } from "../types/api/TAPI";
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
export function checkApi(data: Record<string, unknown>, checker: TAPIChecker): string | undefined {
	for (const [key] of Object.entries(data)) {
		if (!(key in checker)) return `Unexpected field: ${key}`;
	}

	for (const [key, value] of Object.entries(checker)) {
		if (!(key in data) && !value.optional) return `Missing field: ${key}`;
		if (!(key in data) && value.optional) continue;
		else if (value.type != "checker" && value.type != "array" && typeof data[key] != value.type)
			return `Wrong field type: ${key} (got: ${typeof data[key]}, expected: ${value.type})`;
		else if (value.type == "array" && !Array.isArray(data[key]))
			return `Wrong field type: ${key} (got: ${typeof data[key]}, expected: array)`;
		else if (value.type == "checker" && value.checker) {
			const res: string | undefined = checkApi(
				data[key] as Record<string, unknown>,
				value.checker,
			);
			if (res) return res;
		}
	}
}

export const apiCheckReponse = <_T extends object>(
	data: IAPIData<_T>,
	target: keyof _T | TAPIChecker,
	errorCallback: TErrorReturn,
): boolean => {
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
		const res: string | undefined = checkApi(data.data as Record<string, unknown>, target);
		if (res) {
			const error: IAPIData<_T> = apiMakeError(-2, { error: [res] }, errorCallback.type);
			if (errorCallback.type == "error") errorCallback.handler(error.error);
			else
				errorCallback.handler({
					severity: "error",
					message: error.error,
				});
			return false;
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
	query?: Record<string, string | number>
): Promise<IAPIData<_T>> => {
	try {
		const response = await api.get<_T>(API_BASE_SIMPLE + path, query ? {params: query} : undefined);
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
	query?: Record<string, string | number>
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.post<_Res>(API_BASE_SIMPLE + path, request, query ? {params: query} : undefined);
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
	query?: Record<string, string | number>
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.put<_Res>(API_BASE_SIMPLE + path, request, query ? {params: query} : undefined);
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
	query?: Record<string, string | number>
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.patch<_Res>(API_BASE_SIMPLE + path, request, query ? {params: query} : undefined);
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
	query?: Record<string, string | number>
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.delete<_Res>(API_BASE_SIMPLE + path, { data: request, params: query ? query : undefined });
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
