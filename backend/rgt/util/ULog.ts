export const ulog = (msg: string) => {
	console.log(msg);
};

export const uErrorResponse = (msg: unknown, code: number) => {
	console.error(`Request failed [${code}] with message: ${msg}`);
};
export const uError = (msg: string, error?: unknown) => {
	console.error(msg, error);
};
