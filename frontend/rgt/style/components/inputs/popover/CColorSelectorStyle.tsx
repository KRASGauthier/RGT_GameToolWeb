import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../../src/style/theme";

//--------------------------------------------------
//                    CONSTS
//--------------------------------------------------
export const buttonSize = 25;

//--------------------------------------------------
//                     OUTPUT
//--------------------------------------------------
export interface IColorSelectorStyle {
	main: SxProps<Theme>;
	grid: SxProps<Theme>;
	gridContent: SxProps<Theme>;
	button: (color: string) => SxProps<Theme>;
}

export interface CColorSelectorStyleProps {}

export const CColorSelectorStyle = ({}: CColorSelectorStyleProps): IColorSelectorStyle => {
	return {
		main: {},
		grid: {
			width: buttonSize * 11 + 70 + "px",
			height: buttonSize * 11 + 60 + "px",
		},
		gridContent: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		button: (color: string) => {
			return {
				borderRadius: appTheme.shapes.radius.tiny,
				minWidth: 0,
				width: buttonSize + "px",
				height: buttonSize + "px",
				p: 0,
				background: color,

				"&::before": {
					borderRadius: appTheme.shapes.radius.tiny,
				},
			};
		},
	};
};
