import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../theme";

export interface IPProfileStyle {
	main: SxProps<Theme>;
	form: SxProps<Theme>;
	input: SxProps<Theme>;
	buttons: SxProps<Theme>;
}


export const PProfileStyle = (): IPProfileStyle => {
	return {
		main: {
			flex: 1,
			p: appTheme.shapes.spacing.medium,
			gap: "20px",
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
