import type { SxProps, Theme } from "@mui/material";

export interface ISelectorButtonIconStyle {
	main: SxProps<Theme>;
}

export interface CSelectorButtonIconStyleProps {}

export const CSelectorButtonIconStyle =
	({}: CSelectorButtonIconStyleProps): ISelectorButtonIconStyle => {
		return {
			main: {},
		};
	};
