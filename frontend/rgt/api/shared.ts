import axios from "axios";
import { API_BASE } from "../../src/consts";
import { type IAPIData, type IAPIErrors } from "../types/api/TAPI";
import { apiMakeError } from "./errors";
import type { ReactNode } from "react";
import type { TErrorReturn, TErrorReturnTypes } from "../types/TError";

export const api = axios.create({
	baseURL: API_BASE,
});

//--------------------------------------------------
//                      ERROR
//--------------------------------------------------
export const apiCheckReponse = <_T extends object>(
	data: IAPIData<_T>,
	target: keyof _T,
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
	if (!data.data) {
		const error: ReactNode = apiMakeError(
			-1,
			{ error: ["No data collected"] },
			errorCallback.type,
		);
		if (errorCallback.type == "error") errorCallback.handler(error);
		else
			errorCallback.handler({
				severity: "error",
				message: error,
			});
		return false;
	}
	if (!(target in data.data)) {
		const error: ReactNode = apiMakeError(
			-1,
			{ error: ["Data doesn't contain the field: " + target.toString()] },
			errorCallback.type,
		);
		if (errorCallback.type == "error") errorCallback.handler(error);
		else
			errorCallback.handler({
				severity: "error",
				message: error,
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
): Promise<IAPIData<_T>> => {
	try {
		const response = await api.get<_T>(path);
		return { data: response.data };
	} catch (e: unknown) {
		if (axios.isAxiosError<IAPIErrors>(e))
			return { error: apiMakeError(e.response?.status, e.response?.data, type) };
		return { error: apiMakeError(undefined, undefined, type) };
	}
};

export const apiPostData = async <_Req, _Res>(
	path: string,
	request: _Req,
	type?: TErrorReturnTypes,
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.post<_Res>(path, request);
		return { data: response.data };
	} catch (e: unknown) {
		if (axios.isAxiosError<IAPIErrors>(e))
			return { error: apiMakeError(e.response?.status, e.response?.data, type) };
		return { error: apiMakeError(undefined, undefined, type) };
	}
};

export const apiPutData = async <_Req, _Res>(
	path: string,
	request: _Req,
	type?: TErrorReturnTypes,
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.put<_Res>(path, request);
		return { data: response.data };
	} catch (e: unknown) {
		if (axios.isAxiosError<IAPIErrors>(e))
			return { error: apiMakeError(e.response?.status, e.response?.data, type) };
		return { error: apiMakeError(undefined, undefined, type) };
	}
};

export const apiPatchData = async <_Req, _Res>(
	path: string,
	request: _Req,
	type?: TErrorReturnTypes,
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.patch<_Res>(path, request);
		return { data: response.data };
	} catch (e: unknown) {
		if (axios.isAxiosError<IAPIErrors>(e))
			return { error: apiMakeError(e.response?.status, e.response?.data, type) };
		return { error: apiMakeError(undefined, undefined, type) };
	}
};

export const apiDeleteData = async <_Req, _Res>(
	path: string,
	request: _Req,
	type?: TErrorReturnTypes,
): Promise<IAPIData<_Res>> => {
	try {
		const response = await api.delete<_Res>(path, { data: request });
		return { data: response.data };
	} catch (e: unknown) {
		if (axios.isAxiosError<IAPIErrors>(e))
			return { error: apiMakeError(e.response?.status, e.response?.data, type) };
		return { error: apiMakeError(undefined, undefined, type) };
	}
};
