import { Slider, type SliderProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import {
	CSliderStyle,
	type ISliderStyle,
	type TSliderStylingTypes,
} from "../../../style/components/inputs/CSliderStyle";
import { useMemo } from "react";
import { sxMerger } from "../../../util/UStyles";

export interface CSliderProps extends SliderProps, GCompProps {
	styling?: TSliderStylingTypes;
}

function CSlider({ styling, sx, ...other }: CSliderProps) {
	const style: ISliderStyle = useMemo(() => {
		return CSliderStyle({ styling });
	}, [styling]);

	return <Slider sx={sxMerger(style.main, sx ?? {})} {...other} />;
}

export default CSlider;
