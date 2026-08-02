import type { SxProps, Theme } from "@mui/material";
import type { CSplitterPosition } from "../../../components/splitters/CSplitter";
import { appTheme } from "../../../../src/style/theme";

export interface TSplitterStyle {
	main: SxProps<Theme>;
}

export const CSplitterStyle = (
	position: CSplitterPosition,
	size: number,
	secondSize: string | number,
	spacing: string | number,
	color?: string,
): TSplitterStyle => {
	if (position == "row") {
		return {
			main: {
				height: typeof secondSize == "number" ? secondSize + "%" : secondSize,
				width: size + "px",
				mx: typeof spacing == "number" ? spacing + "px" : spacing,

				backgroundColor: color ? color : appTheme.colors.greys[5],
				borderRadius: appTheme.shapes.radius.small,
			},
		};
	}
	return {
		main: {
			width: typeof secondSize == "number" ? secondSize + "%" : secondSize,
			height: size + "px",
			my: typeof spacing == "number" ? spacing + "px" : spacing,

			backgroundColor: color ? color : appTheme.colors.greys[5],
			borderRadius: appTheme.shapes.radius.small,
		},
	};
};
