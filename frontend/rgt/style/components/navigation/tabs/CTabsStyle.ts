import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../../src/style/theme";
import type { TQuadStyle } from "../../../../types/TStyles";

export type TTabsStyling = "light" | "light-ter";

export interface ITabsStyle {
	main: SxProps<Theme>;
	tab: SxProps<Theme>;
	text: SxProps<Theme>;
}

export interface CTabsStyleProps {
	styling: TTabsStyling;
}

export const CTabsStyle = ({ styling }: CTabsStyleProps): ITabsStyle => {
	//Default == light
	let fontColor: TQuadStyle<string> = {
		normal: appTheme.colors.white,
		focused: appTheme.colors.primary[8],
	};
	if (styling == "light-ter") {
		fontColor = {
			normal: appTheme.colors.white,
			focused: appTheme.colors.tertiary[8],
		};
	}

	return {
		main: {
			"& .MuiTabs-indicator": {
				backgroundColor: fontColor.focused,
			},
		},
		tab: {
			color: fontColor.normal,

			"&.Mui-selected": {
				color: fontColor.focused,
			},
		},
		text: {
			color: "inherit",
		},
	};
};
