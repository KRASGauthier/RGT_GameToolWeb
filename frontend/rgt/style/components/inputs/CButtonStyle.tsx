import { type SxProps, type Theme } from "@mui/material";
import {
	colorGetBackground,
	getQuadStyle,
	shadowGenerate,
	sizeToString,
} from "../../../utils/UStyles";
import { appTheme } from "../../../../src/style/theme";
import type { CButtonGlobalProps } from "../../../components/inputs/buttons/CButton";

export interface IButtonStyle {
	main: SxProps<Theme>;
	text: SxProps<Theme>;
	icon: SxProps<Theme>;
	nav: SxProps<Theme>;
}

export interface IButtonStyleProps extends CButtonGlobalProps {}

export const CButtonStyle = ({
	bgColor,
	bgColorHover,
	bgColorDisabled,

	elevation,

	textColor,
	textHoverColor,

	padding,

	checked = false,
	styling = "light",
}: IButtonStyleProps): IButtonStyle => {
	//====================== COLOR ======================
	if (!bgColor || bgColor.length == 0) {
		bgColor = [appTheme.colors.primary[4], appTheme.colors.quaternary[5]];
		if (styling == "dark")
			bgColor = [appTheme.colors.primary[2], appTheme.colors.quaternary[3]];
		else if (styling == "light")
			bgColor = [appTheme.colors.primary[6], appTheme.colors.quaternary[7]];
	}
	const background = colorGetBackground(bgColor, undefined, "linear", 145);

	if (!bgColorHover || bgColorHover.length == 0) {
		bgColorHover = [appTheme.colors.secondary[4], appTheme.colors.quinary[5]];
		if (styling == "dark")
			bgColorHover = [appTheme.colors.secondary[2], appTheme.colors.quinary[3]];
		else if (styling == "light")
			bgColorHover = [appTheme.colors.secondary[6], appTheme.colors.quinary[7]];
	}
	const backgroundHover = colorGetBackground(bgColorHover, undefined, "linear", 145);

	if (!bgColorDisabled || bgColorDisabled.length == 0) {
		bgColorDisabled = [appTheme.colors.greys[4], appTheme.colors.greys[5]];
		if (styling == "dark")
			bgColorDisabled = [appTheme.colors.greys[2], appTheme.colors.greys[3]];
		else if (styling == "light")
			bgColorDisabled = [appTheme.colors.greys[6], appTheme.colors.greys[7]];
	}
	const backgroundDisabled = colorGetBackground(bgColorDisabled, undefined, "linear", 145);

	//====================== TEXT ======================
	if (!textHoverColor && textColor) textHoverColor = textColor;
	else if (!textHoverColor && !textColor) {
		textHoverColor = appTheme.colors.white;
		if (styling == "dark") textHoverColor = appTheme.colors.white;
		else if (styling == "light") textHoverColor = appTheme.colors.black;
	}

	if (!textColor) {
		textColor = appTheme.colors.white;
		if (styling == "dark") textColor = appTheme.colors.white;
		else if (styling == "light") textColor = appTheme.colors.black;
	}

	return {
		main: {
			background,
			color: textColor,
			borderRadius: appTheme.shapes.radius.large,
			boxShadow: shadowGenerate(getQuadStyle(elevation) ?? 15),
			p: padding ?? sizeToString(padding, "6px 16px"),

			"& > *": {
				zIndex: 1,
			},

			"&:hover": {
				color: textHoverColor,
				boxShadow: shadowGenerate(getQuadStyle(elevation, "hovered") ?? 30),
			},

			"&.Mui-disabled": {
				background: backgroundDisabled,
				boxShadow: shadowGenerate(getQuadStyle(elevation, "disabled") ?? 0),
			},

			"&::before": {
				content: '""',
				position: "absolute",
				inset: 0,
				zIndex: 0,

				background: backgroundHover,
				opacity: 0,

				transition: (theme) => {
					return theme.transitions.create(["opacity"], {
						duration: appTheme.animations.timing.medium_fast,
					});
				},

				borderRadius: appTheme.shapes.radius.large,
			},
			"&:hover::before": {
				opacity: 1,
			},

			transition: (theme) => {
				return theme.transitions.create(["box-shadow"], {
					duration: appTheme.animations.timing.medium_fast,
				});
			},
		},
		text: {},
		icon: {
			borderRadius: appTheme.shapes.radius.small,
			p: sizeToString(padding, "8px"),
			"&::before": {
				borderRadius: appTheme.shapes.radius.small,
			},
		},
		nav: {
			ml: "3px",
			height: appTheme.shapes.header.height * 0.8 + "px",
			width: appTheme.shapes.header.height * 0.8 + "px",
			background: checked
				? colorGetBackground(
						[appTheme.colors.primary[8], appTheme.colors.quinary[7]],
						undefined,
						"linear",
						160,
					)
				: colorGetBackground(
						[appTheme.colors.primary[6], appTheme.colors.quaternary[7]],
						undefined,
						"linear",
						160,
					),

			"&:hover::before": {
				opacity: 0,
			},
		},
	};
};
