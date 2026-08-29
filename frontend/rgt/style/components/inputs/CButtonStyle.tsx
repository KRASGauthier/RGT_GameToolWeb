import { type SxProps, type Theme } from "@mui/material";
import {
	colorGetBackground,
	getQuadStyle,
	shadowGenerate,
	sizeToString,
} from "../../../utils/UStyles";
import { appTheme } from "../../../../src/style/theme";
import type {
	CButtonGlobalProps,
	TButtonStylingTypes,
} from "../../../components/inputs/buttons/CButton";

//--------------------------------------------------
//                    STYLING
//--------------------------------------------------
interface IButtonStyling {
	normal: string[];
	hovered: string[];
	disabled: string[];
	type?: "linear" | "radial";
	text?: string;
	textHover?: string;
}
type TButtonStyling = Record<TButtonStylingTypes, IButtonStyling>;

const stylingContent: TButtonStyling = {

	//--------------------- Checked ---------------------
	dark: {
		normal: [appTheme.colors.primary[2], appTheme.colors.quaternary[3]],
		hovered: [
			appTheme.colors.primary[2],
			appTheme.colors.secondary[2],
			appTheme.colors.quinary[3],
		],
		disabled: [appTheme.colors.greys[2], appTheme.colors.greys[3]],
	},
	medium: {
		normal: [appTheme.colors.primary[4], appTheme.colors.quaternary[5]],
		hovered: [
			appTheme.colors.primary[4],
			appTheme.colors.secondary[4],
			appTheme.colors.quinary[5],
		],
		disabled: [appTheme.colors.greys[4], appTheme.colors.greys[5]],
	},
	light: {
		normal: [appTheme.colors.primary[6], appTheme.colors.quaternary[7]],
		hovered: [
			appTheme.colors.primary[6],
			appTheme.colors.secondary[6],
			appTheme.colors.quinary[7],
		],
		disabled: [appTheme.colors.greys[6], appTheme.colors.greys[7]],
	},
	validate: {
		normal: [appTheme.colors.valid[3], appTheme.colors.valid[4], appTheme.colors.valid[3]],
		hovered: [
			appTheme.colors.valid[5],
			appTheme.colors.secondary[6],
			appTheme.colors.quinary[5],
		],
		disabled: [appTheme.colors.greys[5], appTheme.colors.greys[6], appTheme.colors.greys[5]],
	},
	cancel: {
		normal: [appTheme.colors.error[3], appTheme.colors.error[4], appTheme.colors.error[3]],
		hovered: [
			appTheme.colors.error[5],
			appTheme.colors.secondary[6],
			appTheme.colors.quinary[5],
		],
		disabled: [appTheme.colors.greys[5], appTheme.colors.greys[6], appTheme.colors.greys[5]],
	},
	transparent: {
		normal: [
			appTheme.colors.black + Math.trunc(255 * 0.1).toString(16),
			appTheme.colors.black + "00",
		],
		hovered: [
			appTheme.colors.black + Math.trunc(255 * 0.35).toString(16),
			appTheme.colors.black + Math.trunc(255 * 0.25).toString(16),
		],
		disabled: [appTheme.colors.greys[5], appTheme.colors.greys[6]],
		type: "radial",
	},


	//--------------------- Checked ---------------------,
	checkedLight: {
		normal: [appTheme.colors.secondary[6], appTheme.colors.quinary[7]],
		hovered: [
			appTheme.colors.secondary[6],
			appTheme.colors.primary[6],
			appTheme.colors.quaternary[7],
		],
		disabled: [appTheme.colors.greys[6], appTheme.colors.greys[7]],
		text:appTheme.colors.black
	},
};

//--------------------------------------------------
//                      SX
//--------------------------------------------------
export interface IButtonStyle {
	main: SxProps<Theme>;
	text: SxProps<Theme>;
	icon: SxProps<Theme>;
	nav: SxProps<Theme>;
}

export interface IButtonStyleProps extends CButtonGlobalProps {}

export const CButtonStyle = ({
	elevation,

	padding,

	checked = false,
	styling = "light",
	checkedStyling,
}: IButtonStyleProps): IButtonStyle => {

	let currentStyling: TButtonStylingTypes = styling;
	if(checked)
		currentStyling = checkedStyling ?? `checked${styling.charAt(0).toUpperCase()}${styling.slice(1)}` as TButtonStylingTypes


	//====================== COLOR ======================
	const background = colorGetBackground(
		stylingContent[currentStyling].normal,
		undefined,
		stylingContent[currentStyling].type ?? "linear",
		145,
	);
	const backgroundHover = colorGetBackground(
		stylingContent[currentStyling].hovered,
		undefined,
		stylingContent[currentStyling].type ?? "linear",
		145,
	);
	const backgroundDisabled = colorGetBackground(
		stylingContent[currentStyling].disabled,
		undefined,
		stylingContent[currentStyling].type ?? "linear",
		145,
	);

	//====================== TEXT ======================
	const textColor = stylingContent[currentStyling].text ?? appTheme.colors.white;
	const textHoverColor = stylingContent[currentStyling].textHover ?? stylingContent[currentStyling].text ?? appTheme.colors.white;

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

//--------------------------------------------------
//                     PRE-MADE
//------------------------------------------------	--
export interface IButtonCopyStyle {
	main: SxProps<Theme>;
	button: SxProps<Theme>;
	over: SxProps<Theme>;
}

export interface CButtonCopyStyleProps {
	copied: boolean;
}

export const CButtonCopyStyle = ({ copied }: CButtonCopyStyleProps): IButtonCopyStyle => {
	return {
		main: {
			position: "relative",
		},
		button: {},
		over: {
			pointerEvents: copied ? "auto" : "none",
			opacity: copied ? 1 : 0,
			position: "absolute",
			inset: 0,
			p: 0,
			zIndex: 1,

			transition: (theme: Theme) => {
				return theme.transitions.create(["opacity"], {
					duration: appTheme.animations.timing.medium_slow,
				});
			},
		},
	};
};
