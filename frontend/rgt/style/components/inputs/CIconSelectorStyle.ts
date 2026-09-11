import type { SxProps, Theme } from "@mui/material";

export interface IIconSelectorStyle {
	main: SxProps<Theme>;
	stack: SxProps<Theme>;
	stackButton: SxProps<Theme>;
}

export interface CIconSelectorStyleProps {}

export const CIconSelectorStyle = ({}: CIconSelectorStyleProps): IIconSelectorStyle => {
	return {
		main: {},
		stack: {
			minHeight: "200px",
			maxHeight: "246px",
			width: "300px",
		},
		stackButton: {
			overflow: "auto",
			rowGap: "4px",
		},
	};
};
