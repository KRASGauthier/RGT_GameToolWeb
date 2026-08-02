import type { SxProps, Theme } from "@mui/material";

export interface ICAlertStyle {
	main: SxProps<Theme>;
}

export const CAlertStyle = (fadeoutSpeed: number): ICAlertStyle => {
	return {
		main: {
			transition: (theme) => {
				return theme.transitions.create(["opacity"], {
					duration: fadeoutSpeed,
				});
			},
		},
	};
};
