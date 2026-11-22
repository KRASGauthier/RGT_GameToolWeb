import type { SxProps, Theme } from "@mui/material";
import { colorAlterColor, colorGetBackground } from "../../../../../util/UStyles";

export interface ISliderButtonStyle {
	main: SxProps<Theme>;
}

export interface CSliderButtonStyleProps {
	color: string;
}

export const CSliderButtonStyle = ({ color }: CSliderButtonStyleProps): ISliderButtonStyle => {
	return {
		main: {
			background: colorGetBackground(
				[color, colorAlterColor(color, ["shift-hue", "shift-brightness"], [10, -0.15])],
				{ angle: 135 },
			),
		},
	};
};
