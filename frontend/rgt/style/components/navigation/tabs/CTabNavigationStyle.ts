import type { SxProps, Theme } from "@mui/material";
import { colorGetBackground, shadowGenerate } from "../../../../utils/UStyles";
import { appTheme } from "../../../../../src/style/theme";

export interface ITabNavigationStyle {
	main: SxProps<Theme>;
	home: SxProps<Theme>;
}

export interface CTabNavigationStyleProps {}

export const CTabNavigationStyle = ({}: CTabNavigationStyleProps): ITabNavigationStyle => {
	return {
		main: {
			alignItems: "flex-end",

			background: colorGetBackground(
				[
					appTheme.colors.greys[1] + "bf",
					appTheme.colors.greys[2] + "bf",
					appTheme.colors.greys[1] + "bf",
				],
				undefined,
				"linear",
				130,
			),
			boxShadow: shadowGenerate(25, true, true),
		},
		home: {
			px: "10px",
			py: "2px",
			mx: "5px !important",
			borderRadius: `${appTheme.shapes.radius.tiny} ${appTheme.shapes.radius.tiny} 0px 0px`,

			"::before": {
				borderRadius: `${appTheme.shapes.radius.tiny} ${appTheme.shapes.radius.tiny} 0px 0px`,
			},

			color: appTheme.colors.white,
		},
	};
};

export interface ITabNavigationButtonStyle {
	main: SxProps<Theme>;
	button: SxProps<Theme>;
	icon: SxProps<Theme>;
	text: SxProps<Theme>;
	close: SxProps<Theme>;
	closeIcon: SxProps<Theme>;
}

export interface CTabNavigationButtonStyleProps {}

export const CTabNavigationButtonStyle =
	({}: CTabNavigationButtonStyleProps): ITabNavigationButtonStyle => {
		return {
			main: {
				position: "relative",
				alignItems: "center",
				px: "10px",
				py: "2px",
			},
			button: {
				position: "absolute",
				inset: 0,
				borderRadius: `${appTheme.shapes.radius.tiny} ${appTheme.shapes.radius.tiny} 0px 0px`,
				textTransform: "none",

				"::before": {
					borderRadius: `${appTheme.shapes.radius.tiny} ${appTheme.shapes.radius.tiny} 0px 0px`,
				},
			},
			icon: {
				fontSize: appTheme.fonts.text.size["md"],
				userSelect: "none",
				pointerEvents: "none",
			},
			text: {
				userSelect: "none",
				pointerEvents: "none",
			},
			close: {
				p: 0,
				pointerEvents: "visible",
			},
			closeIcon: {
				fontSize: appTheme.fonts.text.size["md"],
			},
		};
	};
