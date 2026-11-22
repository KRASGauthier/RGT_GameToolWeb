import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../../src/style/theme";

export interface ISliderSelectorStyle {
	main: SxProps<Theme>;
	paper: SxProps<Theme>;
	slider: SxProps<Theme>;
}

export interface CSliderSelectorStyleProps {}

export const CSliderSelectorStyle = ({}: CSliderSelectorStyleProps): ISliderSelectorStyle => {
	return {
		main: {},
		paper: {
			borderRadius: appTheme.shapes.radius.small,
			px: "25px",
			pt: "10px",
			pb: "5px",
		},
		slider: {
			minWidth: "200px",
		},
	};
};
