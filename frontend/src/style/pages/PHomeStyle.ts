import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../theme";

export interface IHomeStyle {
	main: SxProps<Theme>;
}

export interface PHomeStyleProps {}

export const PHomeStyle = ({}: PHomeStyleProps): IHomeStyle => {
	return {
		main: {},
	};
};

export interface IHomeProjectCardStyle {
	main: SxProps<Theme>;
	stack: SxProps<Theme>;
	image: SxProps<Theme>;
	textsStack: SxProps<Theme>;
	texts: SxProps<Theme>;
	textsSub: SxProps<Theme>;
}

export interface PHomeProjectCardProps {}

export const PHomeProjectCardStyle = ({}: PHomeProjectCardProps): IHomeProjectCardStyle => {
	return {
		main: {
			textTransform: "none",
			height: "100%",
			width: "100%",
			alignItems: "stretch",
		},
		stack: {
			width: "100%",
			alignContent: "flex-start",
		},
		image: {
			borderTopLeftRadius: appTheme.shapes.radius.small,
			borderTopRightRadius: appTheme.shapes.radius.small,
		},
		textsStack: {
			mx: "15px",
			justifyContent: "space-between",
		},
		texts: {
			textAlign: "left",
		},
		textsSub: {
			textAlign: "right",
			color: appTheme.colors.quaternary[8],
		},
	};
};
