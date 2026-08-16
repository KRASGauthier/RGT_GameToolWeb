import { Card, type CardProps } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import {
	CCardStyle,
	type ICardStyle,
	type TCardStyling,
} from "../../style/components/surfaces/CCardStyle";
import { useMemo } from "react";
import { sxMerger } from "../../utils/UStyles";
import type { TQuadStyle } from "../../types/TStyles";

export interface CCardProps extends GCompProps, Omit<CardProps, "elevation"> {
	elevation?: TQuadStyle<number>;
	styling?: TCardStyling;
}

function CCard({ elevation, styling = "normal", sx, ...other }: CCardProps) {
	const style: ICardStyle = useMemo(() => {
		return CCardStyle({ elevation, styling });
	}, [elevation, styling]);

	return <Card sx={sxMerger(style.main, sx ? sx : {})} {...other}></Card>;
}

export default CCard;
