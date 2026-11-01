import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";

export interface ISelectorButtonIconStyle {
	main: SxProps<Theme>;
	stack: SxProps<Theme>;
	node: (color: string, isFirst: boolean, isNone?: boolean) => SxProps<Theme>;
	extraText: SxProps<Theme>;
}

export interface CSelectorButtonIconStyleProps {}

export const CSelectorButtonIconStyle =
	({}: CSelectorButtonIconStyleProps): ISelectorButtonIconStyle => {
		return {
			main: {},
			stack: {
				flexDirection: "row",
			},
			node: (color: string, isFirst: boolean, isNone?: boolean) => {
				return {
					background: color,
					borderRadius: isNone ? appTheme.shapes.radius.small : "50%",
					padding: "5px",
					display: "grid",
					placeItems: "center",
					alignSelf: "center",
					ml: isFirst ? undefined : "-10px",
					flexShrink: 0,
				};
			},
			extraText: {
				margin: "4px",
				lineHeight: 1,
				p: 0,
			},
		};
	};
