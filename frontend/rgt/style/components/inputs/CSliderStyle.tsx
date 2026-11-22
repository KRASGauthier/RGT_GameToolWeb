import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";

//--------------------------------------------------
//                     STYLING
//--------------------------------------------------
interface ISliderStyling {
	color: string;
	thumbShadow: string;
	thumbShadowActive: string;
}

const stylingContent = {
	"grey-light": {
		color: appTheme.colors.greys[8],
		thumbShadow:
			appTheme.colors.greys[9] +
			Number(Math.trunc(0.15 * 255))
				.toString(16)
				.padStart(2, "0"),
		thumbShadowActive:
			appTheme.colors.greys[9] +
			Number(Math.trunc(0.05 * 255))
				.toString(16)
				.padStart(2, "0"),
	},
} as const satisfies Record<string, ISliderStyling>;
export type TSliderStylingTypes = keyof typeof stylingContent;

//--------------------------------------------------
//                       SX
//--------------------------------------------------
export interface ISliderStyle {
	main: SxProps<Theme>;
}

export interface CSliderStyleProps {
	styling?: TSliderStylingTypes;
}

export const CSliderStyle = ({ styling = "grey-light" }: CSliderStyleProps): ISliderStyle => {
	const current: ISliderStyling = stylingContent[styling];
	return {
		main: {
			minWidth: "150px",
			color: current.color,

			"&:hover .MuiSlider-thumb": {
				boxShadow: "0px 0px 0px 8px " + current.thumbShadow,
			},
			"&:hover .MuiSlider-thumb.Mui-active": {
				boxShadow: "0px 0px 0px 14px " + current.thumbShadowActive,
			},
		},
	};
};
