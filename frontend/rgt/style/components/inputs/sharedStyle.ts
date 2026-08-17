import { appTheme } from "../../../../src/style/theme";

//COLOR
export type CInputOutlinedStyling = "light" | "neutral" | "valid";
export interface CInputOutlinedColor {
	label: string;
	labelActive?: string;
	labelError: string;
	labelErrortext: string;
	labelBG?: string;

	bg: string;
	bgHovered: string;
	bgFocus: string;
	bgDisabled: string;

	bgError: string;
	bgErrorHovered: string;
	bgErrorFocus: string;
	bgErrorDisabled: string;

	outline: string;
	outlineHovered: string;
	outlineFocus: string;
	outlineDisabled: string;
	outlineError: string;
}
export const getLightColor = (): CInputOutlinedColor => {
	return {
		label: appTheme.colors.black,
		labelActive: appTheme.colors.white,
		labelError: appTheme.colors.error[4],
		labelErrortext: appTheme.colors.white,
		labelBG: appTheme.colors.quaternary[2],

		bg: appTheme.colors.primary[8],
		bgHovered: appTheme.colors.primary[9],
		bgFocus: appTheme.colors.quaternary[9],
		bgDisabled: appTheme.colors.greys[5],

		bgError: appTheme.colors.error[8],
		bgErrorHovered: appTheme.colors.error[9],
		bgErrorFocus: appTheme.colors.error[9],
		bgErrorDisabled: appTheme.colors.error[5],

		outline: appTheme.colors.quaternary[1],
		outlineHovered: appTheme.colors.quaternary[1],
		outlineFocus: appTheme.colors.quaternary[2],
		outlineDisabled: appTheme.colors.greys[9],
		outlineError: appTheme.colors.error[5],
	};
};
export const getNeutralColor = (): CInputOutlinedColor => {
	return {
		label: appTheme.colors.black,
		labelActive: appTheme.colors.white,
		labelError: appTheme.colors.error[4],
		labelErrortext: appTheme.colors.white,
		labelBG: appTheme.colors.primary[2],

		bg: appTheme.colors.primary[7],
		bgHovered: appTheme.colors.primary[8],
		bgFocus: appTheme.colors.primary[9],
		bgDisabled: appTheme.colors.greys[5],

		bgError: appTheme.colors.error[8],
		bgErrorHovered: appTheme.colors.error[9],
		bgErrorFocus: appTheme.colors.error[9],
		bgErrorDisabled: appTheme.colors.error[5],

		outline: appTheme.colors.primary[1],
		outlineHovered: appTheme.colors.primary[1],
		outlineFocus: appTheme.colors.primary[2],
		outlineDisabled: appTheme.colors.greys[9],
		outlineError: appTheme.colors.error[5],
	};
};

export const getValidColor = (): CInputOutlinedColor => {
	return {
		label: appTheme.colors.black,
		labelActive: appTheme.colors.white,
		labelError: appTheme.colors.error[4],
		labelErrortext: appTheme.colors.white,
		labelBG: appTheme.colors.valid[2],

		bg: appTheme.colors.valid[7],
		bgHovered: appTheme.colors.valid[8],
		bgFocus: appTheme.colors.valid[9],
		bgDisabled: appTheme.colors.greys[5],

		bgError: appTheme.colors.error[8],
		bgErrorHovered: appTheme.colors.error[9],
		bgErrorFocus: appTheme.colors.error[9],
		bgErrorDisabled: appTheme.colors.error[5],

		outline: appTheme.colors.valid[1],
		outlineHovered: appTheme.colors.valid[1],
		outlineFocus: appTheme.colors.valid[2],
		outlineDisabled: appTheme.colors.greys[9],
		outlineError: appTheme.colors.error[5],
	};
};
