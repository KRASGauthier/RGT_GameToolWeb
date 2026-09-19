import type { SxProps, Theme } from "@mui/material";
import type { TColorEntry } from "../../../../rgt/types/TStyles";
import {
	colorAlterColor,
	colorGetBackground,
	colorGetTextColor,
} from "../../../../rgt/utils/UStyles";
import { appTheme } from "../../theme";

export interface IProjectGroupsEntryStyle {
	main: SxProps<Theme>;
	text: SxProps<Theme>;
	splitters: SxProps<Theme>;
}

export interface PProjectGroupsEntryStyleProps {
	color: TColorEntry;
}

export const PProjectGroupsEntryStyle = ({
	color,
}: PProjectGroupsEntryStyleProps): IProjectGroupsEntryStyle => {
	return {
		main: {
			background: colorGetBackground(
				[color, colorAlterColor(color, ["shift-brightness", "shift-hue"], [0.08, 8])],
				{ angle: appTheme.gradients.rotations.main },
			),
			flexShrink: 0,
		},
		text: {
			color: colorGetTextColor(color),
		},
		splitters: {
			mx: "5px !important",
			alignSelf: "stretch",
			backgroundColor: colorGetTextColor(
				color,
				colorAlterColor(color, ["shift-brightness", "shift-hue"], [0.2, -8]),
				colorAlterColor(color, ["shift-brightness", "shift-hue"], [-0.15, -8]),
			),
		},
	};
};
