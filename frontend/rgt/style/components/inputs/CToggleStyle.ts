import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import type { TSize } from "../../../types/TStyles";
import { sizeToString } from "../../../utils/UStyles";

export interface IToggleStyle {
	main: SxProps<Theme>;
	button: SxProps<Theme>;
	buttonLeft: SxProps<Theme>;
	buttonRight: SxProps<Theme>;
}

export interface CToggleStyleProps {
	borderRadius?: TSize;
	borderColor?: string;
}

export const CToggleStyle = ({
	borderRadius = appTheme.shapes.radius.large,
	borderColor = appTheme.colors.greys[8],
}: CToggleStyleProps): IToggleStyle => {
	return {
		main: {},
		button: {
			borderRadius: 0,
			borderRight: `solid 2px ${borderColor ?? appTheme.colors.greys[8]}`,

			"&::before": {
				borderRadius: 0,
			},
		},
		buttonLeft: {
			borderTopLeftRadius: sizeToString(borderRadius),
			borderBottomLeftRadius: sizeToString(borderRadius),

			"&::before": {
				borderTopLeftRadius: sizeToString(borderRadius),
				borderBottomLeftRadius: sizeToString(borderRadius),
			},
		},
		buttonRight: {
			borderTopRightRadius: sizeToString(borderRadius),
			borderBottomRightRadius: sizeToString(borderRadius),
			borderRight: `none`,

			"&::before": {
				borderTopRightRadius: sizeToString(borderRadius),
				borderBottomRightRadius: sizeToString(borderRadius),
			},
		},
	};
};
