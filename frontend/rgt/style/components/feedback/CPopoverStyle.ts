import type { SxProps, Theme } from "@mui/material";

export interface IPopoverStyle {
	main: SxProps<Theme>;
}

export interface CPopoverStyleProps {}

export const CPopoverStyle = ({}: CPopoverStyleProps): IPopoverStyle => {
	return {
		main: {},
	};
};
