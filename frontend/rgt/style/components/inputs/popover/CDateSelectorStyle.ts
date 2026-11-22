import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../../src/style/theme";

export interface IDateSelectorStyle {
	main: SxProps<Theme>;
	arrowLeftButtons: SxProps<Theme>;
	arrowRightButtons: SxProps<Theme>;

	dayGrid: SxProps<Theme>;
	dayButton: (date: Date, currentMonth: number) => SxProps<Theme>;

	monthYearStack: SxProps<Theme>;
}

export interface CDateSelectorStyleProps {}

export const CDateSelectorStyle = ({}: CDateSelectorStyleProps): IDateSelectorStyle => {
	const buttonSize = 25;

	return {
		main: {},
		arrowLeftButtons: {
			p: 0,
			borderTopRightRadius: 0,
			borderBottomRightRadius: 0,

			"&::before": {
				borderTopRightRadius: 0,
				borderBottomRightRadius: 0,
			},
		},
		arrowRightButtons: {
			p: 0,
			borderTopLeftRadius: 0,
			borderBottomLeftRadius: 0,

			"&::before": {
				borderTopLeftRadius: 0,
				borderBottomLeftRadius: 0,
			},
		},
		dayGrid: {
			mx: "auto",
			width: buttonSize * 10 + "px",
			height: buttonSize * 7 + "px",
			maxHeight: "300px",
		},
		dayButton: (date: Date, currentMonth: number) => {
			return {
				color: date.getMonth() != currentMonth ? appTheme.colors.greys[7] : undefined,
				p: 0,
				minWidth: 0,
				width: buttonSize + "px",
				height: buttonSize + "px",
				borderRadius: appTheme.shapes.radius.large,
			};
		},

		monthYearStack: {
			maxHeight: "250px",
		},
	};
};
