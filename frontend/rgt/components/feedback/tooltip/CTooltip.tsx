import { Tooltip, type TooltipProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import {
	CTooltipStyle,
	type ITooltipStyle,
} from "../../../style/components/feedback/CTooltipStyle";
import { useMemo } from "react";

export interface CTooltipProps extends GCompProps, TooltipProps {}

function CTooltip({ ...other }: CTooltipProps) {
	const style: ITooltipStyle = useMemo(() => {
		return CTooltipStyle({});
	}, []);

	return <Tooltip sx={style.main} {...other} />;
}

export default CTooltip;
