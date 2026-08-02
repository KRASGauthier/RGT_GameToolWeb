import type { SxProps, Theme } from "@mui/material";

export interface IListStyle {
	main: SxProps<Theme>;
	itemButton: SxProps<Theme>;
	itemIcon: SxProps<Theme>;
	itemText: SxProps<Theme>;
}

export const CListStyle = (): IListStyle => {
	return {
		main: {},
		itemButton: {},
		itemIcon: {},
		itemText: {},
	};
};
