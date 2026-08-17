import { Typography, type TypographyProps } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import type { TFontSize } from "../../types/themeType";
import { sxMerger } from "../../utils/UStyles";
import { useMemo, type ReactNode } from "react";
import { CTextStyles } from "../../style/components/text/CTextStyles";

export interface CTextBaseProps extends GCompProps, Omit<TypographyProps, "variant"> {
	mutliline?: boolean;
	size?: TFontSize;
	weight?: number;
	sizeTable: Record<TFontSize, number>;
	fontFamily: string;
}

function CTextBase({
	mutliline,

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

	const getMultiLine = () => {
		if (typeof children != "string") return children;
		const lines: string[] = children.split("\n");
		const output: ReactNode[] = [];
		lines.forEach((line: string, index: number) => {
			if (index != 0) output.push(<br />);
			output.push(line);
		});
		return output;
	};

	return (
		<Typography sx={sxMerger(sx ? sx : {}, style.main)} variant="body1" {...other}>
			{mutliline ? getMultiLine() : children}
		</Typography>
	);
}

export default CTextBase;
