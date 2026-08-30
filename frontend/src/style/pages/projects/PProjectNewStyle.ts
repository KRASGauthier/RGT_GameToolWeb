import type { SxProps, Theme } from "@mui/material";
import { colorGetBackground } from "../../../../rgt/utils/UStyles";
import { appTheme } from "../../theme";

export interface IProjectNewStyle {
	main: SxProps<Theme>;
	addIcon: SxProps<Theme>;
}

export interface PProjectNewStyleProps {}

export const PProjectNewStyle = ({}: PProjectNewStyleProps): IProjectNewStyle => {
	return {
		main: {},
		addIcon: {
			mr: appTheme.shapes.spacing.main,
			borderRadius: appTheme.shapes.radius.tiny,
			background: colorGetBackground(
				[appTheme.colors.secondary[6], appTheme.colors.quinary[7]],
				undefined,
				"linear",
				180,
			),
			color: appTheme.colors.white,
		},
	};
};
