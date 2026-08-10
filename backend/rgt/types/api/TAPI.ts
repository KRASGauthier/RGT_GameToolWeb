export type TErrorInfo = Record<string, string>;
export interface IAPIData<_T> {
	data?: _T;
	error?: string;
	errorInfo?: TErrorInfo;
}

export interface IAPIErrors {
	error: string[];
	errorInfo?: TErrorInfo;
}
