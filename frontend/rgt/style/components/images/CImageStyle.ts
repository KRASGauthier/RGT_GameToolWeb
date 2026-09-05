import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import { colorGetBackground } from "../../../utils/UStyles";

//--------------------------------------------------
//                    STYLING
//--------------------------------------------------

interface IImageStylingObject {
	background: string;
}

const stylings = {
	grey: {
		background: colorGetBackground(
			[appTheme.colors.greys[2], appTheme.colors.greys[3]],
			undefined,
			"linear",
			135,
		),
	},
	"primary-dark": {
		background: colorGetBackground(
			[appTheme.colors.primary[2], appTheme.colors.quinary[2]],
			[-25, 125],
			"linear",
			135,
		),
	},
	"secondary-dark": {
		background: colorGetBackground(
			[appTheme.colors.secondary[2], appTheme.colors.quaternary[2]],
			[-25, 125],
			"linear",
			135,
		),
	},
} as const satisfies Record<string, IImageStylingObject>;
export type TImageStyling = keyof typeof stylings;

//--------------------------------------------------
//                      MAIN
//--------------------------------------------------
export interface IImageStyle {
	main: SxProps<Theme>;
	empty: SxProps<Theme>;
	image: SxProps<Theme>;
}

export interface CImageStyleProps {
	styling?: TImageStyling;
	aspectRatio: string;
	styled?: boolean;
}

export const CImageStyle = ({
	aspectRatio,
	styled,
	styling = "grey",
}: CImageStyleProps): IImageStyle => {
	const localStyling: IImageStylingObject = stylings[styling];

	return {
		main: {
			position: "relative",
			aspectRatio: aspectRatio,
		},
		empty: {
			border: styled ? "solid 3px " + appTheme.colors.primary[0] : undefined,
			borderRadius: styled ? appTheme.shapes.radius.medium : undefined,
			background: localStyling.background,
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
