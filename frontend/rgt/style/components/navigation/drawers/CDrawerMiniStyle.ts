import type { SxProps, Theme } from "@mui/material";
import {
	colorGetAtPos,
	colorGetBackground,
	getQuadStyle,
	shadowGenerate,
} from "../../../../utils/UStyles";
import { appTheme } from "../../../../../src/style/theme";
import type { TQuadStyle } from "../../../../types/TStyles";

export interface IDrawerMiniStyle {
	main: SxProps<Theme>;
	button: SxProps<Theme>;
}

export interface CDrawerMiniStyleProps {
	elevation?: TQuadStyle<number>;
	open: boolean;

	openWidth: number;
	closedWidth: number;
}

export const CDrawerMiniStyle = ({
	elevation,
	open,
	openWidth,
	closedWidth,
}: CDrawerMiniStyleProps): IDrawerMiniStyle => {
	return {
		main: {
			position: "relative",
			width: open ? openWidth + "px" : closedWidth + "px",
			background: colorGetBackground(
				[
					colorGetAtPos(appTheme.colors.greys[2], appTheme.colors.greys[1], 0.5) + "60",
					colorGetAtPos(appTheme.colors.greys[2], appTheme.colors.greys[1], 0.5) + "60",
				],
				undefined,
				"linear",
				180,
			),
			boxShadow: shadowGenerate(getQuadStyle(elevation) ?? 50),

			transition: (theme: Theme) =>
				theme.transitions.create(["width"], {
					duration: appTheme.animations.timing.medium_fast,
				}),
		},
		button: {
			mt: "15px",
			ml: open ? "5px" : "7px",
			px: 0,
			minWidth: 0,
			width: open ? openWidth - 10 + "px" : closedWidth - 15 + "px",
			transition: (theme: Theme) =>
				theme.transitions.create(["width"], {
					duration: appTheme.animations.timing.medium_fast,
				}),
		},
	};
};
