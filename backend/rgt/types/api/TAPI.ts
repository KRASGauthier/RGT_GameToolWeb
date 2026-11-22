import type { TTypeOf } from "../TShared.js";

export type TErrorInfo = Record<string, string>;
export interface IAPIData<_T> {
	data?: _T;
	status: number;
	error?: string;
	errorInfo?: TErrorInfo;
}

export interface IAPIErrors {
	error: string[];
	errorInfo?: TErrorInfo;
}

export type TAPICheckInfoTypes = TTypeOf | "checker" | "date";
export interface IAPICheckInfo {
	type: TAPICheckInfoTypes;
	isArray?: boolean;
	optional?: boolean;
	checker?: Record<string, IAPICheckInfo>;
}
export type TAPIChecker = Record<string, IAPICheckInfo>;
