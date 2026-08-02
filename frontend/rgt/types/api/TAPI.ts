import type { ReactNode } from "react";

export interface IAPIData<_T> {
	data?: _T;
	error?: ReactNode;
}

export interface IAPIErrors {
	error: string[];
}
