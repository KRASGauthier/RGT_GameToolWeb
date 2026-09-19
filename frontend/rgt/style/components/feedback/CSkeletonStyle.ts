import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import { colorGetBackground } from "../../../utils/UStyles";

//====================== STYLING ======================
interface ISkeletonStyleStyling {
	background?: string;
	radius: string | number;
}
const DSkeletonStyleStyling = {
	text: {
		radius: appTheme.shapes.radius.small,
	},
	rectangle: {
		radius: appTheme.shapes.radius.small,
	},
	"rectangle-light": {
		radius: appTheme.shapes.radius.small,
		background: colorGetBackground([appTheme.colors.greys[8], appTheme.colors.greys[7]], {
			positions: undefined,
			type: "linear",
			angle: 150,
		}),
	},
} as const satisfies Record<string, ISkeletonStyleStyling>;
export type TSkeletonStyleStyling = keyof typeof DSkeletonStyleStyling;

//====================== CONTENT ======================
export interface ISkeletonStyle {
	main: SxProps<Theme>;
}

export interface CSkeletonStyleProps {
	styling: TSkeletonStyleStyling;
}

export const CSkeletonStyle = ({ styling }: CSkeletonStyleProps): ISkeletonStyle => {
	const object: ISkeletonStyleStyling = DSkeletonStyleStyling[styling];

	return {
		main: {
			borderRadius: object.radius,
			minHeight: "35px",
			background: object.background,
		},
	};
};
