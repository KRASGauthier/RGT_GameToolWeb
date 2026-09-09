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

export interface IAPICheckInfo {
	type: TTypeOf | "checker" | "array";
	optional?: boolean;
	checker?: Record<string, IAPICheckInfo>;
}
export type TAPIChecker = Record<string, IAPICheckInfo>;
