import type { SxProps, Theme } from "@mui/material";
import type { TQuadStyle } from "../../../../types/TStyles";
import { colorGetBackground, getQuadStyle, shadowGenerate } from "../../../../utils/UStyles";
import { appTheme } from "../../../../../src/style/theme";
import type { TListMenuCompData } from "../../../../components/data/lists/subs/CListMenuComp";
import type { IThemeColor } from "../../../../types/themeType";
import type { TListMenuGroupData } from "../../../../components/data/lists/subs/CListMenuGroup";

const getColor = (level: number, value?: string | keyof IThemeColor): string => {
	if (!value) return appTheme.colors.primary[level];
	if (value in appTheme.colors) return appTheme.colors[value as keyof IThemeColor][level];
	return value;
};

export interface IListMenuStyle {
	main: SxProps<Theme>;
}
export const CListMenuStyle = (): IListMenuStyle => {
	return {
		main: {
			overflowY: "auto",
		},
	};
};

export interface IListMenuCompStyle {
	component: SxProps<Theme>;
	itemButton: SxProps<Theme>;
	itemIcon: SxProps<Theme>;
	itemText: SxProps<Theme>;
}
export interface CListMenuCompStyleProps {
	comp: TListMenuCompData;
	small?: boolean
}

export const CListMenuCompStyle = ({ comp, small}: CListMenuCompStyleProps): IListMenuCompStyle => {
	const elevation: TQuadStyle<number> = {
		normal: 5,
		hovered: 35,
	};

	const color: TQuadStyle<string | keyof IThemeColor> = {
		normal: getColor(2, getQuadStyle(comp.color, "normal")),
		hovered: getColor(4, getQuadStyle(comp.color, "hovered")),
		pressed: getColor(6, getQuadStyle(comp.color, "pressed")),
	};

	return {
		component: {
			overflow: "hidden"
		},
		itemButton: {
			px: "7px",
			py: "4px",

			mb: "5px",
			ml: "6px",

			gap: "7px",

			boxShadow:
				"-2px 0px 0px 0px " +
				(getQuadStyle(color, "normal") ?? appTheme.colors.primary[2]) +
				", " +
				shadowGenerate(getQuadStyle(elevation, "normal") ?? elevation.normal),

			borderTopLeftRadius: appTheme.shapes.radius.small,
			borderBottomLeftRadius: appTheme.shapes.radius.small,

			transition: (theme: Theme): string =>
				theme.transitions.create(["box-shadow", "margin"], {
					duration: appTheme.animations.timing.fast,
				}),

			"&:hover": {
				boxShadow:
					"-4px 0px 0px 0px " +
					(getQuadStyle(color, "hovered") ?? appTheme.colors.primary[2]) +
					", " +
					shadowGenerate(getQuadStyle(elevation, "hovered") ?? elevation.normal),
				ml: "8px",
			},

			"&.Mui-selected": {
				boxShadow:
					"-4px 0px 0px 0px " +
					(getQuadStyle(color, "pressed") ?? appTheme.colors.primary[2]) +
					", " +
					shadowGenerate(getQuadStyle(elevation, "normal") ?? elevation.normal),
				ml: "8px",
				background: colorGetBackground(
					[
						(getQuadStyle(color, "pressed") ?? appTheme.colors.primary[2]) + "2B",
						(getQuadStyle(color, "pressed") ?? appTheme.colors.primary[2]) + "1B",
					],
					undefined,
					"linear",
					90,
				),
			},

			"&:hover.Mui-selected": {
				boxShadow:
					"-4px 0px 0px 0px " +
					(getQuadStyle(color, "pressed") ?? appTheme.colors.primary[2]) +
					", " +
					shadowGenerate(getQuadStyle(elevation, "normal") ?? elevation.normal),
				ml: "8px",
				background: colorGetBackground(
					[
						(getQuadStyle(color, "pressed") ?? appTheme.colors.primary[2]) + "2B",
						(getQuadStyle(color, "pressed") ?? appTheme.colors.primary[2]) + "1B",
					],
					undefined,
					"linear",
					90,
				),
			},

			"&::after": {
				content: '""',
				position: "absolute",
				width: "2px",
				height: "80%",
				right: small ? "5px" :"10px",
				backgroundColor: getQuadStyle(color, "normal") ?? appTheme.colors.primary[2],
				borderRadius: appTheme.shapes.radius.medium,

				transition: (theme: Theme): string =>
					theme.transitions.create(["background-color", "right"], {
						duration: appTheme.animations.timing.fast,
					}),
			},
			"&:hover::after": {
				backgroundColor: getQuadStyle(color, "hovered") ?? appTheme.colors.primary[2],
			},
			"&.Mui-selected::after": {
				backgroundColor: getQuadStyle(color, "hovered") ?? appTheme.colors.primary[2],
			},
		},
		itemIcon: {
			color: "white",
			minWidth: 0,

			"& .MuiSvgIcon-root": {
				fontSize: "20px",
			},
		},
		itemText: {
			opacity: small? 0 : 1,
			transition: (theme: Theme): string =>
				theme.transitions.create(["opacity"], {
					duration: appTheme.animations.timing.fast,
				}),
		},
	};
};

export interface IListMenuGroupStyle {
	group: SxProps<Theme>;
	groupItemButton: SxProps<Theme>;
	groupItemIcon: SxProps<Theme>;
	groupItemText: SxProps<Theme>;
}
export interface CListMenuGroupStyleProps {
	group: TListMenuGroupData;
	small?: boolean
}

export const CListMenuGroupStyle = ({ group, small }: CListMenuGroupStyleProps): IListMenuGroupStyle => {
	const color: TQuadStyle<string | keyof IThemeColor> = {
		normal: getColor(2, getQuadStyle(group.color, "normal")),
		hovered: getColor(4, getQuadStyle(group.color, "hovered")),
		pressed: getColor(6, getQuadStyle(group.color, "pressed")),
	};

	return {
		group: {},
		groupItemButton: {

			overflow: "hidden",

			px: "4px",
			py: "1px",

			mb: "5px",
			mt: "10px",
			ml: "2px",

			gap: "7px",

			"&::after": {
				content: '""',
				position: "absolute",

				height: "2px",
				width: "95%",

				left: "calc( ( 100% - 95% ) / 2 )",

				bottom: "0px",
				backgroundColor: getQuadStyle(color, "normal") ?? appTheme.colors.primary[2],
				borderRadius: appTheme.shapes.radius.medium,

				transition: (theme: Theme): string =>
					theme.transitions.create(["background-color"], {
						duration: appTheme.animations.timing.fast,
					}),
			},
			"&:hover::after": {
				backgroundColor: getQuadStyle(color, "hovered") ?? appTheme.colors.primary[2],
			},
		},
		groupItemIcon: {
			my: "3px",
			color: getQuadStyle(color, "hovered") ?? appTheme.colors.primary[2],
			justifyContent: small ? "center" : undefined
		},
		groupItemText: {},
	};
};
