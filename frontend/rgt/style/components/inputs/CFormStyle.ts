import type { SxProps, Theme } from "@mui/material";
import { appTheme } from "../../../../src/style/theme";
import { sizeToString } from "../../../utils/UStyles";
import type { TSize } from "../../../types/TStyles";

export interface IFormStyle {
	main: SxProps<Theme>;
	shared: SxProps<Theme>;
}

export interface CFormStyleProps {
	minWidth?: TSize;
}

export const CFormStyle = ({ minWidth }: CFormStyleProps): IFormStyle => {
	return {
		main: {
			pt: appTheme.shapes.spacing.medium,
		},
		shared: {
			minWidth: sizeToString(minWidth, "250px"),
		},
	};
};
