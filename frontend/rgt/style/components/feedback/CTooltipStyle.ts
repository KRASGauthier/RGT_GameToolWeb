import type { SxProps, Theme } from "@mui/material";

export interface ITooltipStyle {
	main: SxProps<Theme>;
}

export interface CTooltipStyleProps {}

export const CTooltipStyle = ({}: CTooltipStyleProps): ITooltipStyle => {
	return {
		main: {},
	};
};
