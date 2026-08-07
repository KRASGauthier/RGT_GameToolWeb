import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import {
	colorGetBackground,
	getQuadStyle,
	shadowGenerate,
	sizeToString,
} from "../../../utils/UStyles";
import type { TQuadStyle } from "../../../types/TStyles";

export type TPaperStyling = "normal" | "normal-wavy";

export interface TPaperStyle {
	main: SxProps<Theme>;
}

export interface CPaperStyleProps {
	elevation?: TQuadStyle<number>;
	styling: TPaperStyling;
	padding?: number | string;
}

export const CPaperStyle = ({ elevation, styling, padding }: CPaperStyleProps): TPaperStyle => {
	//BACKGROUND
	let background = colorGetBackground(
		[appTheme.colors.quaternary[4], appTheme.colors.quaternary[3]],
		undefined,
		"linear",
		165,
	);
	if (styling == "normal-wavy")
		background = colorGetBackground(
			[
				appTheme.colors.quaternary[4],
				appTheme.colors.quaternary[3],
				appTheme.colors.quaternary[4],
			],
			undefined,
			"linear",
			165,
		);

	return {
		main: {
			p: sizeToString(padding, "10px"),
			background,
			boxShadow: shadowGenerate(getQuadStyle(elevation, "normal") ?? 40),

			"&:hover": {
				boxShadow: shadowGenerate(getQuadStyle(elevation, "hovered") ?? 40),
			},

			//border: "solid 4px " + appTheme.colors.primary[0],
		},
	};
};

export interface TPaperTitleStyle {
	main: SxProps<Theme>;
	title: SxProps<Theme>;
	box: SxProps<Theme>;
}

export interface CPaperTitleStyleProps {
	padding?: number | string;
}

export const CPaperTitleStyle = ({ padding }: CPaperTitleStyleProps): TPaperTitleStyle => {
	return {
		main: {
			p: 0,
			overflow: "hidden",
		},
		title: {
			px: "20px",
			py: "5px",
			background: colorGetBackground(
				[appTheme.colors.tertiary[5], appTheme.colors.tertiary[3]],
				undefined,
				"linear",
				125,
			),
			textAlign: "center",
		},
		box: {
			p: sizeToString(padding, "10px"),
		},
	};
};
