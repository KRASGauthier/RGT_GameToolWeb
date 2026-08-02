import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import { colorGetBackground, getQuadStyle, shadowGenerate } from "../../../utils/UStyles";
import type { TQuadStyle } from "../../../types/TStyles";

export interface TPaperStyle {
	main: SxProps<Theme>;
}

export interface CPaperStyleProps {
	elevation?: TQuadStyle<number>;
}

export const CPaperStyle = ({ elevation }: CPaperStyleProps): TPaperStyle => {
	return {
		main: {
			p: "10px",
			background: colorGetBackground(
				[appTheme.colors.quaternary[4], appTheme.colors.quaternary[3]],
				undefined,
				"linear",
				165,
			),
			boxShadow: shadowGenerate(getQuadStyle(elevation, "normal") ?? 40),

			"&:hover": {
				boxShadow: shadowGenerate(getQuadStyle(elevation, "hovered") ?? 40),
			},

			//border: "solid 4px " + appTheme.colors.primary[0],
		},
	};
};
