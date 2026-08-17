import { useTheme, type SxProps, type Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import {
	getLightColor,
	getNeutralColor,
	getValidColor,
	type CInputOutlinedColor,
} from "./sharedStyle";
import type { CTextFieldOutlinedProps } from "../../../components/inputs/text/CTextFieldOutlined";
import { getQuadStyle, shadowGenerate } from "../../../utils/UStyles";

export interface ITextFieldOutlinedStyle {
	main: SxProps<Theme>;
}

export interface CTextFieldOutlinedStyleProps extends CTextFieldOutlinedProps {}

export const CTextFieldOutlinedStyle = ({
	styling,
	fontSize,
	weight,
	fontFamily,
	borderRadius,
	borderWidth,
	xPadding,
	yPadding,
	elevation,
}: CTextFieldOutlinedStyleProps): ITextFieldOutlinedStyle => {
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

	let colors: CInputOutlinedColor = getLightColor();
	if (styling && styling == "neutral") colors = getNeutralColor();
	if (styling && styling == "valid") colors = getValidColor();

	return {
		main: {
			"& .MuiInputLabel-root": {
				color: colors.label,
				px: "5px",
				borderRadius: appTheme.shapes.radius.small,
				top: "50%",
				transform: "translate(14px, -50%) scale(1)",
				transition: theme.transitions.create([
					"top",
					"transform",
					"color",
					"background-color",
				]),
			},
			"&:hover .MuiInputLabel-root": {
				color: colors.label,
			},
			"& .MuiInputLabel-root.Mui-focused  ": {
				color: colors.label,
			},

			"& .MuiInputLabel-root.Mui-error ": {
				color: colors.labelError,
			},
			"& .MuiInputLabel-root.MuiInputLabel-shrink": {
				top: 0,
				transform: "translate(10px, -9px) scale(0.75)",
				backgroundColor: colors.labelBG,
				color: colors.labelActive,
			},
			"& .MuiInputLabel-root.Mui-error.MuiInputLabel-shrink": {
				backgroundColor: colors.labelError,
				color: colors.labelErrortext,
			},

			//Input root
			"& .MuiOutlinedInput-root": {
				backgroundColor: colors.bg,
				transition: theme.transitions.create(["background-color", "box-shadow"], {
					duration: appTheme.animations.timing.medium_fast,
				}),
				fontSize: finalFontSize,
				fontFamily: fontFamily ? fontFamily : appTheme.fonts.text.family,
				fontWeight: weight == undefined ? 400 : weight,
				borderRadius:
					borderRadius == undefined ? appTheme.shapes.radius.small : borderRadius,
				boxShadow: shadowGenerate(getQuadStyle(elevation) ?? 0),
			},
			"& .MuiOutlinedInput-root.Mui-error ": {
				backgroundColor: colors.bgError,
			},

			"&:hover .MuiOutlinedInput-root": {
				backgroundColor: colors.bgHovered,
				border: "none",
				boxShadow: shadowGenerate(getQuadStyle(elevation, "hovered") ?? 15),
			},
			"&:hover .MuiOutlinedInput-root.Mui-error ": {
				backgroundColor: colors.bgErrorHovered,
			},

			"& .MuiOutlinedInput-root.Mui-focused": {
				backgroundColor: colors.bgFocus,
				boxShadow: shadowGenerate(getQuadStyle(elevation, "focused") ?? 25),
			},
			"& .MuiOutlinedInput-root.Mui-focused.Mui-error ": {
				backgroundColor: colors.bgErrorHovered,
			},

			"& .MuiOutlinedInput-root.Mui-disabled": {
				backgroundColor: colors.bgDisabled,
				boxShadow: shadowGenerate(getQuadStyle(elevation, "disabled") ?? 0),
			},
			"&:hover .MuiOutlinedInput-root.Mui-disabled.Mui-error ": {
				backgroundColor: colors.bgErrorDisabled,
			},

			//INput objkect
			"& .MuiOutlinedInput-root .MuiInputBase-input": {
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
			"& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
				borderColor: colors.outlineHovered,
				borderWidth: borderWidth,
			},
			"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
				borderColor: colors.outlineFocus,
				borderWidth: borderWidth,
			},
			"& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
				borderColor: colors.outlineDisabled,
				borderWidth: borderWidth,
			},

			"& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
				borderColor: colors.outlineError,
			},
		},
	};
};

export interface ITextFieldOutlinedMultilineStyle {
	main: SxProps<Theme>;
}

export interface CTextFieldOutlinedMultilineStyleProps {
	xPadding?: string | number;
	yPadding?: string | number;
}

export const CTextFieldOutlinedMultilineStyle = ({
	xPadding,
	yPadding,
}: CTextFieldOutlinedMultilineStyleProps): ITextFieldOutlinedMultilineStyle => {
	xPadding = typeof xPadding == "number" ? xPadding + "px" : xPadding;
	if (xPadding == undefined) xPadding = "10px";
	if (yPadding != undefined) yPadding = typeof yPadding == "number" ? yPadding + "px" : yPadding;
	if (yPadding == undefined) yPadding = "10px";
	return {
		main: {
			//INput objkect
			"& .MuiOutlinedInput-root": {
				py: yPadding,
				px: xPadding,
			},
			"& .MuiOutlinedInput-root .MuiInputBase-input": {
				p: 0,
			},
		},
	};
};
