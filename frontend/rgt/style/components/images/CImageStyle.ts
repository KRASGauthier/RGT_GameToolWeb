import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import { colorGetBackground } from "../../../utils/UStyles";

//--------------------------------------------------
//                    STYLING
//--------------------------------------------------

export interface IImageStylingObject {
	background: string;
	backgroundBorken: string;
	imageBrokenColor: string;
}

const stylings = {
	grey: {
		background: colorGetBackground([appTheme.colors.greys[2], appTheme.colors.greys[3]], {
			positions: undefined,
			type: "linear",
			angle: 135,
		}),
		backgroundBorken: colorGetBackground([appTheme.colors.greys[1], appTheme.colors.greys[2]], {
			positions: undefined,
			type: "linear",
			angle: 135,
		}),
		imageBrokenColor: appTheme.colors.error[5],
	},
	"primary-dark": {
		background: colorGetBackground([appTheme.colors.primary[2], appTheme.colors.quinary[2]], {
			positions: [-25, 125],
			type: "linear",
			angle: 135,
		}),
		backgroundBorken: colorGetBackground([appTheme.colors.greys[2], appTheme.colors.greys[3]], {
			positions: [-25, 125],
			type: "linear",
			angle: 135,
		}),
		imageBrokenColor: appTheme.colors.error[6],
	},
	"secondary-dark": {
		background: colorGetBackground(
			[appTheme.colors.secondary[2], appTheme.colors.quaternary[2]],
			{ positions: [-25, 125], type: "linear", angle: 135 },
		),
		backgroundBorken: colorGetBackground([appTheme.colors.greys[2], appTheme.colors.greys[3]], {
			positions: [-25, 125],
			type: "linear",
			angle: 135,
		}),
		imageBrokenColor: appTheme.colors.error[6],
	},
} as const satisfies Record<string, IImageStylingObject>;
export type TImageStyling = keyof typeof stylings;
export const imageStylingGetStyling = (styling: TImageStyling): IImageStylingObject => {
	return stylings[styling];
};

//--------------------------------------------------
//                      MAIN
//--------------------------------------------------
export interface IImageStyle {
	main: SxProps<Theme>;
	empty: SxProps<Theme>;
	image: SxProps<Theme>;
	brokenStack: SxProps<Theme>;
	brokenImage: SxProps<Theme>;
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
			left: 0,
			border: styled ? "solid 3px " + appTheme.colors.primary[0] : undefined,
			borderRadius: styled ? appTheme.shapes.radius.medium : undefined,
		},
		brokenStack: {
			border: styled ? "solid 3px " + appTheme.colors.primary[0] : undefined,
			borderRadius: styled ? appTheme.shapes.radius.medium : undefined,
			background: localStyling.backgroundBorken,
			position: "absolute",
			inset: 0,
			justifyContent: "center",
			alignItems: "center",
		},
		brokenImage: {
			color: localStyling.imageBrokenColor,
			height: "35%",
			width: "35%",
		},
	};
};
