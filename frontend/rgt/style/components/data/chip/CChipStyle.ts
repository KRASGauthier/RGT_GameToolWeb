import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../../src/style/theme";
import { colorGetBackground } from "../../../../utils/UStyles";


//--------------------------------------------------
//                     STYLING
//--------------------------------------------------
interface ICChipStylingComponent {
	color: string;
	fontColor?: string;
}
const DChipStylings = {
	primary: {
		color: colorGetBackground([appTheme.colors.primary[5], appTheme.colors.primary[6]], undefined, "linear", 175)
	}
} as const satisfies Record<string, ICChipStylingComponent>
export type TChipStyling = keyof typeof DChipStylings;

//--------------------------------------------------
//                     OBJECTS
//--------------------------------------------------
export interface IChipStyle {
	main: SxProps<Theme>
}

export interface CChipStyleProps {
	styling?: TChipStyling;
}

export const CChipStyle = ({styling = "primary"}: CChipStyleProps): IChipStyle => {

	const current: ICChipStylingComponent = DChipStylings[styling];

	return {
		main: {
			background: current.color
		}
	}
}