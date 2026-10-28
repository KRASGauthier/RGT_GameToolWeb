import { Stack, type StackProps } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import {
	CStackStyling,
	type IStackStyling,
	type TStackStyling,
} from "../../style/components/layout/CStackStyling";
import { useMemo } from "react";
import { sxMerger } from "../../utils/UStyles";
import type { TSize } from "../../types/TStyles";
import type { TThemeRadius } from "../../types/themeType";

export interface CStackProps extends GCompProps, StackProps {
	borderRadius?: TSize | TThemeRadius;
	styling?: TStackStyling;
	overflow?: boolean;
}

function CStack({ borderRadius, styling, overflow, sx, ...other }: CStackProps) {
	const style: IStackStyling = useMemo(() => {
		return CStackStyling({ borderRadius, styling, overflow });
	}, [borderRadius, styling, overflow]);

	return <Stack sx={sxMerger(style.main, sx ? sx : {})} {...other} />;
}

export default CStack;
