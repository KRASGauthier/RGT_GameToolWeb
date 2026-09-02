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
	type: TTypeOf | "checker";
	checker?: Record<string, IAPICheckInfo>;
	optional?: boolean;
}
export type TAPIChecker = Record<string, IAPICheckInfo>;
