import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import { colorGetBackground } from "../../../utils/UStyles";

export interface IImageStyle {
	main: SxProps<Theme>;
	empty: SxProps<Theme>;
	image: SxProps<Theme>;
}

export interface CImageStyleProps {
	aspectRatio: string;
	styled?: boolean;
}

export const CImageStyle = ({ aspectRatio, styled }: CImageStyleProps): IImageStyle => {
	return {
		main: {
			position: "relative",
			aspectRatio: aspectRatio,
		},
		empty: {
			border: styled ? "solid 3px " + appTheme.colors.primary[0] : undefined,
			borderRadius: styled ? appTheme.shapes.radius.medium : undefined,
			background: colorGetBackground(
				[appTheme.colors.greys[2], appTheme.colors.greys[3]],
				undefined,
				"linear",
				135,
			),
		},
		image: {
			position: "absolute",
			width: "100%",
			height: "100%",
			objectFit: "cover",
			border: styled ? "solid 3px " + appTheme.colors.primary[0] : undefined,
			borderRadius: styled ? appTheme.shapes.radius.medium : undefined,
		},
	};
};
