import type { SxProps, Theme } from "@mui/material";

export interface IDrawerStyle {
	main: SxProps<Theme>;
}

export const CDrawerStyle = (): IDrawerStyle => {
	return {
		main: {},
	};
};
