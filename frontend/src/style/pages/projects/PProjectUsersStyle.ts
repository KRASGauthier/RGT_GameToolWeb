import type { SxProps, Theme } from "@mui/material";
import { colorGetBackground, shadowGenerate } from "../../../../rgt/utils/UStyles";
import { appTheme } from "../../theme";

export interface IProjectUsersStyle {
	main: SxProps<Theme>;
}

export interface PProjectUsersStyleProps {}

export const PProjectUsersStyle = ({}: PProjectUsersStyleProps): IProjectUsersStyle => {
	return {
		main: {
			background: colorGetBackground([appTheme.colors.greys[1], appTheme.colors.greys[0]], {
				type: "linear",
				angle: 175,
				opacities: 0.5,
			}),
			flex: 1,
			my: appTheme.shapes.spacing.medium,
			pt: appTheme.shapes.spacing.small,
			px: appTheme.shapes.spacing.tiny,
			borderRadius: appTheme.shapes.radius.medium,
			boxShadow: shadowGenerate(25, true, true),
			overflow: "hidden",
		},
	};
};
