import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import {
	colorApplyAlpha,
	colorGetBackground,
	getQuadStyle,
	shadowGenerate,
} from "../../../util/UStyles";
import type { TQuadStyle } from "../../../types/TStyles";

//--------------------------------------------------
//                     STYLING
//--------------------------------------------------
interface ICardStyling {
	background: string;
}

const stylingContent = {
	normal: {
		background: colorGetBackground(
			[appTheme.colors.quaternary[4], appTheme.colors.quaternary[3]],
			{ positions: undefined, type: "linear", angle: 165 },
		),
	},
	"grey-light": {
		background: colorGetBackground([appTheme.colors.greys[8], appTheme.colors.greys[7]], {
			positions: undefined,
			type: "linear",
			angle: 165,
		}),
	},
	grey: {
		background: colorGetBackground([appTheme.colors.greys[4], appTheme.colors.greys[3]], {
			positions: undefined,
			type: "linear",
			angle: 165,
		}),
	},
	"warning": {
		background: colorGetBackground(
			[appTheme.colors.warning[5], appTheme.colors.warning[4]],
			{ positions: undefined, type: "linear", angle: 165 },
		),
	},
	"error": {
		background: colorGetBackground(
			[appTheme.colors.error[4], appTheme.colors.error[3]],
			{ positions: undefined, type: "linear", angle: 165 },
		),
	},
	"error-dark": {
		background: colorGetBackground(
			[appTheme.colors.error[2], appTheme.colors.error[1]],
			{ positions: undefined, type: "linear", angle: 165 },
		),
	},
	"error-dark-grey": {
		background: colorGetBackground(
			[appTheme.colors.greys[2], appTheme.colors.error[1]],
			{ positions: undefined, type: "linear", angle: 165 },
		),
	},
	"glass-dark": {
		background: colorGetBackground(
			[
				colorApplyAlpha(appTheme.colors.greys[2], 0.25),
				colorApplyAlpha(appTheme.colors.greys[3], 0.35),
			],
			{
				positions: undefined,
				type: "linear",
				angle: 165,
			},
		),
	},
} as const satisfies Record<string, ICardStyling>;

export type TCardStyling = keyof typeof stylingContent;

//--------------------------------------------------
//                      STYLE
//--------------------------------------------------
export interface ICardStyle {
	main: SxProps<Theme>;
}

export interface CCardStyleProps {
	elevation?: TQuadStyle<number>;
	styling: TCardStyling;
}

export const CCardStyle = ({ elevation, styling }: CCardStyleProps): ICardStyle => {
	const current = stylingContent[styling];
	return {
		main: {
			p: "10px",
			background: current.background,
			boxShadow: shadowGenerate(getQuadStyle(elevation, "normal") ?? 20),

			"&:hover": {
				boxShadow: shadowGenerate(getQuadStyle(elevation, "hovered") ?? 20),
			},
			//border: "solid 2px " + appTheme.colors.primary[0],
		},
	};
};
