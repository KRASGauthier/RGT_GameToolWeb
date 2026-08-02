import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import { colorGetBackground, getQuadStyle, shadowGenerate } from "../../../utils/UStyles";
import type { TQuadStyle } from "../../../types/TStyles";

export interface ICardStyle {
	main: SxProps<Theme>;
}

export interface CCardStyleProps {
	elevation?: TQuadStyle<number>;
}

export const CCardStyle = ({ elevation }: CCardStyleProps): ICardStyle => {
	return {
		main: {
			p: "10px",
			background: colorGetBackground(
				[appTheme.colors.quaternary[4], appTheme.colors.quaternary[3]],
				undefined,
				"linear",
				165,
			),
			boxShadow: shadowGenerate(getQuadStyle(elevation, "normal") ?? 20),

			"&:hover": {
				boxShadow: shadowGenerate(getQuadStyle(elevation, "hovered") ?? 20),
			},
			//border: "solid 2px " + appTheme.colors.primary[0],
		},
	};
};
