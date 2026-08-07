import { Box, Stack } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import { sxMerger } from "../../utils/UStyles";
import { useMemo } from "react";
import {
	CPaperTitleStyle,
	type TPaperTitleStyle,
} from "../../style/components/surfaces/CPaperStyle";
import CPaper, { type CPaperProps } from "./CPaper";
import CTitle from "../text/CTitle";
import type { TFontSize } from "../../types/themeType";

interface CPaperTitleProps extends GCompProps, CPaperProps {
	title: string;
	size?: TFontSize;
}

function CPaperTitle({ title, size = "sm", padding, children, sx, ...other }: CPaperTitleProps) {
	const style: TPaperTitleStyle = useMemo(() => {
		return CPaperTitleStyle({ padding });
	}, [padding]);

	return (
		<CPaper sx={sxMerger(style.main, sx ? sx : {})} {...other}>
			<Stack direction={"column"}>
				<CTitle weight={5} size={size} sx={style.title}>
					{title}
				</CTitle>
				<Box sx={style.box}>{children}</Box>
			</Stack>
		</CPaper>
	);
}

export default CPaperTitle;
