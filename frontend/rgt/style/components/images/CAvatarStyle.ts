import type { SxProps, Theme } from "@mui/material";
import { colorGetBackground } from "../../../utils/UStyles";
import { appTheme } from "../../../../src/style/theme";

export type TAvatarStyling = "light";
export interface IAvatarStyle {
	main: SxProps<Theme>;
}

export interface CAvatarStyleProps {
	styling: TAvatarStyling;
}

export const CAvatarStyle = ({ styling }: CAvatarStyleProps): IAvatarStyle => {
	let background: string[] = [];
	// eslint-disable-next-line prefer-const
	let bgType: "linear" | "radial" = "linear";
	let bgRotation: number = 0;

	switch (styling) {
		case "light":
			background = [
				appTheme.colors.primary[6],
				appTheme.colors.quaternary[7],
				appTheme.colors.tertiary[6],
			];
			bgRotation = 150;
	}

	return {
		main: {
			background: colorGetBackground(background, undefined, bgType, bgRotation),
		},
	};
};
