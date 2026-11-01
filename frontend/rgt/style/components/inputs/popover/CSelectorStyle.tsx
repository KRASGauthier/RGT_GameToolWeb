import type { SxProps, Theme } from "@mui/material";
import { colorAlterColor, colorGetBackground, colorGetTextColor } from "../../../../utils/UStyles";

export interface ISelectorStyle {
	main: SxProps<Theme>;
	button: (selected: boolean, color?: string) => SxProps<Theme>;
}

export interface CSelectorStyleProps {}

export const CSelectorStyle = ({}: CSelectorStyleProps): ISelectorStyle => {
	return {
		main: {},
		button: (selected: boolean, color?: string) => {
			let background: string | undefined;
			let backgroundHovered: string | undefined;
			if (selected) {
				background = color
					? colorGetBackground(
							[
								color,
								colorAlterColor(
									color,
									["shift-hue", "shift-brightness"],
									[-25, -0.1],
								),
							],
							{ angle: 135 },
						)
					: undefined;
				backgroundHovered = color
					? colorGetBackground(
							[
								colorAlterColor(color, ["shift-brightness"], [-0.15]),
								colorAlterColor(
									color,
									["shift-hue", "shift-brightness"],
									[-35, -0.25],
								),
							],
							{ angle: 135 },
						)
					: undefined;
			} else {
				background = color
					? colorGetBackground(
							[
								colorAlterColor(
									color,
									["shift-brightness", "shift-saturation"],
									[-0.4, -0.4],
								),
								colorAlterColor(
									color,
									["shift-hue", "shift-brightness", "shift-saturation"],
									[-25, -0.5, -0.4],
								),
							],
							{ angle: 135 },
						)
					: undefined;
				backgroundHovered = color
					? colorGetBackground(
							[
								colorAlterColor(
									color,
									["shift-brightness", "shift-saturation"],
									[-0.2, -0.4],
								),
								colorAlterColor(
									color,
									["shift-hue", "shift-brightness", "shift-saturation"],
									[-35, -0.3, -0.4],
								),
							],
							{ angle: 135 },
						)
					: undefined;
			}

			const textColor: string | undefined = color
				? colorGetTextColor(
						selected
							? colorAlterColor(
									color,
									["shift-brightness", "shift-saturation"],
									[-0.4, -0.4],
								)
							: color,
					)
				: undefined;

			return {
				background: background,
				textTransform: "none",
				color: textColor,

				"&:hover": {
					color: textColor,
				},

				"&::before": {
					background: backgroundHovered,
					color: textColor,
				},
			};
		},
	};
};
