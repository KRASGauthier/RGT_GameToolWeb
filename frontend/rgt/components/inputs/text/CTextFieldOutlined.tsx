import { TextField, type TextFieldProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import { memo } from "react";
import {
	CTextFieldOutlinedStyle,
	type ITextFieldOutlinedStyle,
} from "../../../style/components/inputs/CTextFieldStyle";
import { sxMerger } from "../../../utils/UStyles";
import type { TFontSize } from "../../../types/themeType";
import type { CInputOutlinedStyling } from "../../../style/components/inputs/sharedStyle";
import type { TQuadStyle } from "../../../types/TStyles";

export interface CTextFieldOutlinedProps extends GCompProps, Omit<TextFieldProps, "variant"> {
	styling?: CInputOutlinedStyling;

	xPadding?: string | number;
	yPadding?: string | number;

	elevation?: TQuadStyle<number>;

	fontSize?: TFontSize;
	weight?: number;
	fontFamily?: string;

	borderRadius?: string | number;
	borderWidth?: string | number;
}

function CTextFieldOutlined({ sx, ...other }: CTextFieldOutlinedProps) {
	const style: ITextFieldOutlinedStyle = CTextFieldOutlinedStyle({ ...other });

	return (
		<TextField
			sx={sxMerger(style.main, sx ? sx : {})}
			variant="outlined"
			{...other}
		></TextField>
	);
}

export default memo(CTextFieldOutlined);
