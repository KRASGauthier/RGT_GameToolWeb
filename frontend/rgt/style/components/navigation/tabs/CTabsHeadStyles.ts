import type { SxProps, Theme } from "@mui/material";
import { colorGetBackground, shadowGenerate } from "../../../../utils/UStyles";
import { appTheme } from "../../../../../src/style/theme";

export interface ITabsHeadStyle {
	main: SxProps<Theme>;
	tab: SxProps<Theme>;
	label: SxProps<Theme>;
}

export interface CTabsHeadStyleProps {
	color: string;
	selectedColor: string;
	elevation: number;
}

export const CTabsHeadStyle = ({
	color,
	selectedColor,
	elevation,
}: CTabsHeadStyleProps): ITabsHeadStyle => {
	return {
		main: {
			background: colorGetBackground(
				[
					appTheme.colors.quaternary[2],
					appTheme.colors.quaternary[3],
					appTheme.colors.quaternary[2],
				],
				undefined,
				"linear",
				155,
			),
			minHeight: 0,
			"& .MuiTabs-indicator": {
				backgroundColor: selectedColor,
			},

			borderRadius: appTheme.shapes.radius.large,
			boxShadow: shadowGenerate(elevation),
		},
		tab: {
			flex: "1 0 auto",
			color: color,
			py: "10px",
			px: "20px",
			minHeight: 0,

			"&.Mui-selected": {
				color: selectedColor,
			},
		},
		label: {
			color: "inherit",

			textWrap: "nowrap",
		},
	};
};
