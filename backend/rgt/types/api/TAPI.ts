
export interface IAPIData<_T> {
	data?: _T;
	error?: string;
}

export interface IAPIErrors {
	error: string[];
}
