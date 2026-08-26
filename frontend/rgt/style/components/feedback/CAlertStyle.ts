import type { SxProps, Theme } from "@mui/material";

export interface ICAlertStyle {
	main: SxProps<Theme>;
}

export const CAlertStyle = (): ICAlertStyle => {
	return {
		main: {},
	};
};
