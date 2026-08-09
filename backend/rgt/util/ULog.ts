export const ulog = (msg: string) => {
	console.log(msg);
};

export const uError = (msg: string, error: unknown) => {
	console.error(msg, error);
};
