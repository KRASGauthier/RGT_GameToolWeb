import { Paper, type PaperProps } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import { sxMerger } from "../../utils/UStyles";
import { useMemo } from "react";
import { CPaperStyle, type TPaperStyle } from "../../style/components/surfaces/CPaperStyle";
import type { TQuadStyle } from "../../types/TStyles";

interface CPaperProps extends GCompProps, Omit<PaperProps, "elevation"> {
	elevation?: TQuadStyle<number>;
}

function CPaper({ elevation, sx, ...other }: CPaperProps) {
	const style: TPaperStyle = useMemo(() => {
		return CPaperStyle({ elevation });
	}, [elevation]);

	return <Paper elevation={0} sx={sxMerger(style.main, sx ? sx : {})} {...other}></Paper>;
}

export default CPaper;
