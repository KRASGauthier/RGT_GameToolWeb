import type { SxProps, Theme } from "@mui/material";
import type { TFontSize } from "../../../types/themeType";

export interface ITextStyles {
	main: SxProps<Theme>;
}

export const CTextStyles = (
	Size: TFontSize,
	SizeTable: Record<TFontSize, number>,
	fontFamily: string,
	weight: number,
) => {
	return {
		main: {
			fontSize: SizeTable[Size] + "px",
			fontFamily: fontFamily,
			fontWeight: weight * 100,
		},
	};
};
