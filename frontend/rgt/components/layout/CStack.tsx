import { Stack, type StackProps } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import {
	CStackStyling,
	type IStackStyling,
	type TStackStyling,
} from "../../style/components/layout/CStackStyling";
import { useMemo } from "react";
import { sxMerger } from "../../utils/UStyles";

export interface CStackProps extends GCompProps, StackProps {
	styling?: TStackStyling;
	overflow?: boolean;
}

function CStack({ styling, overflow, sx, ...other }: CStackProps) {
	const style: IStackStyling = useMemo(() => {
		return CStackStyling({ styling, overflow });
	}, [styling, overflow]);

	return <Stack sx={sxMerger(style.main, sx ? sx : {})} {...other} />;
}

export default CStack;
