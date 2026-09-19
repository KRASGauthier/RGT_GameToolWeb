//--------------------------------------------------
//                     COLORS
//--------------------------------------------------
export const cehckerIsColorEntry = (value: string): boolean => {
	return (
		[
			"primary",
			"secondary",
			"tertiary",
			"quaternary",
			"quinary",
			"greys",
			"valid",
			"warning",
			"error",
			"black",
			"white",
		].includes(value) || /^#[0-9A-Fa-f]{6}$/.test(value)
	);
};
