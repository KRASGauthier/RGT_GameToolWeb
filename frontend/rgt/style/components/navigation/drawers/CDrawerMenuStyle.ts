import type { SxProps, Theme } from "@mui/material";

export interface IDrawerMenuStyle {
	main: SxProps<Theme>;
}

export const CDrawerMenuStyle = (): IDrawerMenuStyle => {
	return {
		main: { position: "absolute", overflow: "hidden", inset: 0 },
	};
};
