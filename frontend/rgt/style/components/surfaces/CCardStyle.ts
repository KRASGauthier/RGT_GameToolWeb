import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import { colorGetBackground, getQuadStyle, shadowGenerate } from "../../../utils/UStyles";
import type { TQuadStyle } from "../../../types/TStyles";

export type TCardStyling = "normal" | "grey" | "grey-light";

export interface ICardStyle {
	main: SxProps<Theme>;
}

export interface CCardStyleProps {
	elevation?: TQuadStyle<number>;
	styling: TCardStyling;
}

export const CCardStyle = ({ elevation, styling }: CCardStyleProps): ICardStyle => {
	let background: string = colorGetBackground(
		[appTheme.colors.quaternary[4], appTheme.colors.quaternary[3]],
		undefined,
		"linear",
		165,
	);
	if (styling == "grey")
		background = colorGetBackground(
			[appTheme.colors.greys[4], appTheme.colors.greys[3]],
			undefined,
			"linear",
			165,
		);
	else if (styling == "grey-light")
		background = colorGetBackground(
			[appTheme.colors.greys[8], appTheme.colors.greys[7]],
			undefined,
			"linear",
			165,
		);

	return {
		main: {
			p: "10px",
			background,
			boxShadow: shadowGenerate(getQuadStyle(elevation, "normal") ?? 20),

			"&:hover": {
				boxShadow: shadowGenerate(getQuadStyle(elevation, "hovered") ?? 20),
			},
			//border: "solid 2px " + appTheme.colors.primary[0],
		},
	};
};
