import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../../src/style/theme";
import { colorAlterColor, colorGetBackground } from "../../../../util/UStyles";

export interface ITagSelectorStyle {
	main: SxProps<Theme>;
	tagStack: SxProps<Theme>;
}

export interface CTagSelectorStyleProps {}

export const CTagSelectorStyle = ({}: CTagSelectorStyleProps): ITagSelectorStyle => {
	return {
		main: {},
		tagStack: {
			px: "4px",
			mt: "10px",
			minHeight: "300px",
			minWidth: "250px",
		},
	};
};

export interface ITagSelectorNodeStyle {
	main: SxProps<Theme>;
}

export interface CTagSelectorStyleNodeProps {
	color: string;
}

export const CTagSelectorNodeStyle = ({
	color,
}: CTagSelectorStyleNodeProps): ITagSelectorNodeStyle => {
	return {
		main: {
			background: colorGetBackground(
				[color, colorAlterColor(color, ["shift-brightness", "shift-hue"], [0.08, 8])],
				{ angle: appTheme.gradients.rotations.main },
			),
			mt: "2px",
			px: "5px",
			py: "5px",
			borderRadius: appTheme.shapes.radius.tiny,
		},
	};
};
