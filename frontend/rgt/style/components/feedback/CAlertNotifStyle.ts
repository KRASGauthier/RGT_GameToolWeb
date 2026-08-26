import type { SxProps, Theme } from "@mui/material";

export interface IAlertNotifStyle {
	main: SxProps<Theme>;
}

export const CAlertNotifStyle = (fadeoutSpeed: number): IAlertNotifStyle => {
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
