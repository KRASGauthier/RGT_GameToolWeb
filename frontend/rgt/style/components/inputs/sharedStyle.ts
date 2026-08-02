import { appTheme } from "../../../../src/style/theme";

//COLOR
export type CInputOutlinedStyling = "active" | "neutral";
export interface CInputOutlinedColor {
	label: string;
	labelActive?: string;
	labelError: string;
	labelBG?: string;

	bg: string;
	bgHovered: string;
	bgFocus: string;
	bgDisabled: string;

	outline: string;
	outlineHovered: string;
	outlineFocus: string;
	outlineDisabled: string;
	outlineError: string;
}
export const getActiveColor = (): CInputOutlinedColor => {
	return {
		label: appTheme.colors.black,
		labelError: appTheme.colors.error[5],

		bg: appTheme.colors.secondary[9],
		bgHovered: appTheme.colors.tertiary[8],
		bgFocus: appTheme.colors.tertiary[9],
		bgDisabled: appTheme.colors.greys[7],

		outline: appTheme.colors.secondary[1],
		outlineHovered: appTheme.colors.tertiary[1],
		outlineFocus: appTheme.colors.tertiary[2],
		outlineDisabled: appTheme.colors.greys[9],
		outlineError: appTheme.colors.error[5],
	};
};
export const getNeutralColor = (): CInputOutlinedColor => {
	return {
		label: appTheme.colors.black,
		labelActive: appTheme.colors.white,
		labelError: appTheme.colors.error[5],
		labelBG: appTheme.colors.primary[2],

		bg: appTheme.colors.primary[7],
		bgHovered: appTheme.colors.primary[8],
		bgFocus: appTheme.colors.primary[9],
		bgDisabled: appTheme.colors.greys[5],

		outline: appTheme.colors.primary[1],
		outlineHovered: appTheme.colors.primary[1],
		outlineFocus: appTheme.colors.primary[2],
		outlineDisabled: appTheme.colors.greys[9],
		outlineError: appTheme.colors.error[5],
	};
};
