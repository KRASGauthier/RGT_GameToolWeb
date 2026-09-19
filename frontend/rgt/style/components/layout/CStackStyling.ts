import type { SxProps, Theme } from "@mui/material";
import { colorGetBackground, shadowGenerate } from "../../../utils/UStyles";
import { appTheme } from "../../../../src/style/theme";

//--------------------------------------------------
//                    STYLINGS
//--------------------------------------------------
interface IStackStylingObject {
	background?: string;
	borderRadius?: string | number;
	boxShadow?: string;
}

const DStackStyling = {
	default: {},
	deep: {
		background: colorGetBackground([appTheme.colors.greys[1], appTheme.colors.greys[0]], {
			type: "linear",
			angle: 175,
			opacities: 0.5,
		}),
		borderRadius: appTheme.shapes.radius.medium,
		boxShadow: shadowGenerate(25, true, true),
	},
} as const satisfies Record<string, IStackStylingObject>;
export type TStackStyling = keyof typeof DStackStyling;

//--------------------------------------------------
//                      DATA
//--------------------------------------------------
export interface IStackStyling {
	main: SxProps<Theme>;
}

export interface CStackStylingProps {
	styling?: TStackStyling;
	overflow?: boolean;
}

export const CStackStyling = ({ styling = "default", overflow }: CStackStylingProps) => {
	const style = DStackStyling[styling] as IStackStylingObject;

	return {
		main: {
			background: style.background,
			flex: overflow ? 1 : undefined,
			borderRadius: style.borderRadius,
			boxShadow: style.boxShadow,
			overflow: overflow ? "visible" : "auto",
		},
	};
};
