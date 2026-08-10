import type { ReactNode } from "react";

export type TErrorInfo = Record<string, string>;
export interface IAPIData<_T> {
	data?: _T;
	error?: ReactNode;
	errorInfo?: TErrorInfo;
}

export interface IAPIErrors {
	error: string[];
	errorInfo?: TErrorInfo;
}
