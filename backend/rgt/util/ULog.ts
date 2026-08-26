export const ulog = (msg: string) => {
	console.log(msg);
};

export const uErrorResponse = (msg: unknown, code: number, log?: string) => {
	console.error(`Request failed [${code}] with message: ${msg}`);
	if (log) console.error(`\t-> ${log}`);
};
export const uError = (msg: string, error?: unknown) => {
	if (error == undefined) console.error(msg);
	else console.error(msg, error);
};
