import { Chip, type ChipProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import { CChipStyle, type IChipStyle } from "../../../style/components/data/chip/CChipStyle";
import { useMemo } from "react";
import { sxMerger } from "../../../utils/UStyles";
import CText from "../../text/CText";

export interface CChipProps extends GCompProps, Omit<ChipProps, "label"> {
	label: string;
}

function CChip({ label, sx, ...other }: CChipProps) {
	const style: IChipStyle = useMemo(() => {
		return CChipStyle({});
	}, []);

	return (
		<Chip label={<CText>{label}</CText>} sx={sxMerger(style.main, sx ? sx : {})} {...other} />
	);
}

export default CChip;
