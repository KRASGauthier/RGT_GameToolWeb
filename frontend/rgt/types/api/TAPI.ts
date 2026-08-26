import type { ReactNode } from "react";
import type { TTypeOf } from "../TShared";

export type TErrorInfo = Record<string, string>;
export interface IAPIData<_T> {
	data?: _T;
	status: number;
	error?: ReactNode;
	errorInfo?: TErrorInfo;
}

export interface IAPIErrors {
	error: string[];
	errorInfo?: TErrorInfo;
}

export interface IAPICheckInfo {
	type: TTypeOf | "checker";
	checker?: Record<string, IAPICheckInfo>;
}
export type TAPIChecker = Record<string, IAPICheckInfo>;
