import type { SxProps, Theme } from "@mui/material";

export interface IPProfileStyle {
	main: SxProps<Theme>;
	form: SxProps<Theme>;
	input: SxProps<Theme>;
	buttons: SxProps<Theme>;
}

export const PProfileStyle = (): IPProfileStyle => {
	return {
		main: {
			p: 2,
			gap: 2,
		},
		form: {
			gap: 2,
		},
		input: {
			width: "100%",
		},
		buttons: {
			gap: 2,
			justifyContent: "flex-end",
			mt: 2,
		},
	};
};