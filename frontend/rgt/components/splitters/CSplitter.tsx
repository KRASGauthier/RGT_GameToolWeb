import { Box, type SxProps, type Theme } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import {
	CSplitterStyle,
	type TSplitterStyle,
} from "../../style/components/splitters/CSplitterStyle";
import { useMemo } from "react";
import { sxMerger } from "../../utils/UStyles";

export type CSplitterPosition = "row" | "column";
export interface CSplitterProps extends GCompProps {
	sx?: SxProps<Theme>;
	size?: number;
	secondSize?: string | number;
	spacing?: string | number;
	color?: string;
	position: CSplitterPosition;
}

function CSplitter({
	position,
	size = 3,
	secondSize = "90%",
	spacing = 5,
	color,
	sx,
	...other
}: CSplitterProps) {
	const style: TSplitterStyle = useMemo(() => {
		return CSplitterStyle(position, size, secondSize, spacing, color);
	}, [position, size, color, secondSize, spacing]);

	return <Box sx={sxMerger(style.main, sx ? sx : {})} {...other}></Box>;
}

export default CSplitter;
