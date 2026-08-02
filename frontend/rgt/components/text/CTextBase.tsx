import { Typography, type TypographyProps } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import type { TFontSize } from "../../types/themeType";
import { sxMerger } from "../../utils/UStyles";
import { useMemo } from "react";
import { CTextStyles } from "../../style/components/text/CTextStyles";

export interface CTextBaseProps extends GCompProps, Omit<TypographyProps, "variant"> {
	size?: TFontSize;
	weight?: number;
	sizeTable: Record<TFontSize, number>;
	fontFamily: string;
}

function CTextBase({
	size = "md",
	weight = 4,
	sizeTable,
	fontFamily,
	sx,
	children,
	...other
}: CTextBaseProps) {
	const style = useMemo(() => {
		return CTextStyles(size, sizeTable, fontFamily, weight);
	}, [size, sizeTable, fontFamily, weight]);

	return (
		<Typography sx={sxMerger(sx ? sx : {}, style.main)} variant="body1" {...other}>
			{children}
		</Typography>
	);
}

export default CTextBase;
