import { Paper, type PaperProps } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import { sxMerger } from "../../utils/UStyles";
import { useMemo } from "react";
import {
	CPaperStyle,
	type TPaperStyle,
	type TPaperStyling,
} from "../../style/components/surfaces/CPaperStyle";
import type { TQuadStyle } from "../../types/TStyles";

export interface CPaperProps extends GCompProps, Omit<PaperProps, "elevation"> {
	styling?: TPaperStyling;
	elevation?: TQuadStyle<number>;

	padding?: number | string;
}

function CPaper({ elevation, styling = "normal", padding, sx, ...other }: CPaperProps) {
	const style: TPaperStyle = useMemo(() => {
		return CPaperStyle({ elevation, styling, padding });
	}, [elevation, styling, padding]);

	return <Paper elevation={0} sx={sxMerger(style.main, sx ? sx : {})} {...other}></Paper>;
}

export default CPaper;
