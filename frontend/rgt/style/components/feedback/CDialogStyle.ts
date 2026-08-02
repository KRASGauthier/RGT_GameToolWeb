import type { SxProps, Theme } from "@mui/material";
import { colorGetBackground } from "../../../utils/UStyles";
import { appTheme } from "../../../../src/style/theme";

export interface IDialogStyle {
	main: SxProps<Theme>;
	content: SxProps<Theme>;
	action: SxProps<Theme>;
}

export const CDialogStyle = (): IDialogStyle => {
	return {
		main: {
			background: colorGetBackground(
				[appTheme.colors.primary[5], appTheme.colors.primary[8]],
				undefined,
				"linear",
				150,
			),
		},
		content: {
			background: colorGetBackground(
				[appTheme.colors.greys[1], appTheme.colors.greys[2]],
				undefined,
				"linear",
				150,
			),
		},
		action: {
			background: colorGetBackground(
				[appTheme.colors.greys[5], appTheme.colors.greys[6]],
				undefined,
				"linear",
				150,
			),
		},
	};
};

export interface IDialogImageStyle {
	main: SxProps<Theme>;
	empty: SxProps<Theme>;
	image: SxProps<Theme>;
}

export interface CDialogImageStyleProps {
	aspectRatio: string;
	editable?: boolean;
}

export const CDialogImageStyle = ({
	aspectRatio,
	editable,
}: CDialogImageStyleProps): IDialogImageStyle => {
	return {
		main: {
			position: "relative",
			width: "70vw",
			aspectRatio: aspectRatio,
		},
		empty: {
			border: "solid 3px " + appTheme.colors.primary[0],
			borderRadius: appTheme.shapes.radius.small,
			background: colorGetBackground(
				[appTheme.colors.greys[2], appTheme.colors.greys[3]],
				undefined,
				"linear",
				135,
			),
			cursor: editable ? "pointer" : undefined,
		},
		image: {
			position: "absolute",
			width: "100%",
			height: "100%",
			objectFit: "cover",
			borderRadius: appTheme.shapes.radius.small,
			border: "solid 3px " + appTheme.colors.primary[0],
			cursor: editable ? "pointer" : undefined,
		},
	};
};
