import { useTheme, type SxProps, type Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import { getActiveColor, getNeutralColor, type CInputOutlinedColor } from "./sharedStyle";
import type { CSelectOutlinedProps } from "../../../components/inputs/select/CSelectOutlined";
import { getQuadStyle, shadowGenerate } from "../../../utils/UStyles";

export interface ISelectSOutlinedStyle {
	main: SxProps<Theme>;
	label: SxProps<Theme>;
}

export interface CSelectOutlinedStyleProps extends Omit<CSelectOutlinedProps, "selection"> {}

export const CSelectOutlinedStyle = ({
	styling,
	fontSize,
	weight,
	fontFamily,
	borderRadius,
	borderWidth,
	xPadding,
	yPadding,
	elevation,
}: CSelectOutlinedStyleProps): ISelectSOutlinedStyle => {
	const theme = useTheme();

	if (xPadding != undefined) xPadding = typeof xPadding == "number" ? xPadding + "px" : xPadding;
	if (xPadding == undefined) xPadding = "10px";
	if (yPadding != undefined) yPadding = typeof yPadding == "number" ? yPadding + "px" : yPadding;
	if (yPadding == undefined) yPadding = "10px";

	const finalFontSize = appTheme.fonts.text.size[fontSize == undefined ? "sm" : fontSize];

	if (borderRadius != undefined)
		borderRadius = typeof borderRadius == "number" ? borderRadius + "px" : borderRadius;
	if (borderWidth != undefined)
		borderWidth = typeof borderWidth == "number" ? borderWidth + "px" : borderWidth;
	if (!borderWidth) borderWidth = "2px";

	let colors: CInputOutlinedColor = getActiveColor();
	if (styling && styling == "neutral") colors = getNeutralColor();

	return {
		main: {
			//Input root
			backgroundColor: colors.bg,
			transition: theme.transitions.create(["background-color"], {
				duration: appTheme.animations.timing.medium_fast,
			}),
			fontSize: finalFontSize,
			fontFamily: fontFamily ? fontFamily : appTheme.fonts.text.family,
			fontWeight: weight == undefined ? 400 : weight,
			borderRadius: borderRadius == undefined ? appTheme.shapes.radius.small : borderRadius,
			boxShadow: shadowGenerate(getQuadStyle(elevation) ?? 0),

			"&:hover": {
				backgroundColor: colors.bgHovered,
				border: "none",
				boxShadow: shadowGenerate(getQuadStyle(elevation, "hovered") ?? 15),
			},

			"&.Mui-focused": {
				backgroundColor: colors.bgFocus,
				boxShadow: shadowGenerate(getQuadStyle(elevation, "pressed") ?? 25),
			},

			"&.Mui-disabled": {
				backgroundColor: colors.bgDisabled,
				boxShadow: shadowGenerate(getQuadStyle(elevation, "disabled") ?? 0),
			},

			//INput objkect
			"& .MuiInputBase-input": {
				color: appTheme.colors.black,
				py: yPadding,
				px: xPadding,
			},

			//Outline
			"& .MuiOutlinedInput-notchedOutline": {
				borderColor: colors.outline,
				borderRadius:
					borderRadius == undefined ? appTheme.shapes.radius.small : borderRadius,
				borderWidth: borderWidth,
				transition: theme.transitions.create(["border-color"], {
					duration: appTheme.animations.timing.medium_fast,
				}),
			},
			"&:hover .MuiOutlinedInput-notchedOutline": {
				borderColor: colors.outlineHovered,
				borderWidth: borderWidth,
			},
			"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
				borderColor: colors.outlineFocus,
				borderWidth: borderWidth,
			},
			"&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
				borderColor: colors.outlineDisabled,
				borderWidth: borderWidth,
			},

			"&.Mui-error .MuiOutlinedInput-notchedOutline": {
				borderColor: colors.outlineError,
			},
		},
		label: {
			color: colors.label,
			px: "5px",
			borderRadius: appTheme.shapes.radius.small,
			top: "50%",
			transform: "translate(14px, -50%) scale(1)",
			transition: theme.transitions.create(["top", "transform", "color", "background-color"]),
			"&:hover": {
				color: colors.label,
			},
			"&.Mui-focused  ": {
				color: colors.label,
			},

			"&.Mui-error ": {
				color: colors.labelError,
			},
			"&.MuiInputLabel-shrink": {
				top: 0,
				transform: "translate(10px, -9px) scale(0.75)",
				backgroundColor: colors.labelBG,
				color: colors.labelActive,
			},
		},
	};
};
