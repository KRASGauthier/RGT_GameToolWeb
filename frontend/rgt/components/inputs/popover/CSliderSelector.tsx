import { useMemo } from "react";
import {
	CSliderSelectorStyle,
	type ISliderSelectorStyle,
} from "../../../style/components/inputs/popover/CSliderSelectorStyle";
import type { CPopoverProps } from "../../feedback/popover/CPopover";
import CPopover from "../../feedback/popover/CPopover";
import CSlider, { type CSliderProps } from "../bars/CSlider";
import { sxMerger } from "../../../util/UStyles";

export interface CSliderSelectorProps extends Omit<CPopoverProps, "onChange"> {
	sliderProps?: CSliderProps;
	value: number;

	onChange?: (value: number) => void;
}

function CSliderSelector({ sliderProps, value, onChange, sx, ...other }: CSliderSelectorProps) {
	const style: ISliderSelectorStyle = useMemo(() => {
		return CSliderSelectorStyle({});
	}, []);

	const { sx: sliderSx, ...otherSlider } = sliderProps ?? {};

	return (
		<CPopover paperProps={{ sx: style.paper }} sx={sxMerger(style.main, sx ?? {})} {...other}>
			<CSlider
				value={value}
				onChange={(_, nVal: number | number[]) => {
					onChange?.(Array.isArray(nVal) ? (nVal[0] ?? 0) : nVal);
				}}
				sx={sxMerger(style.slider, sliderSx ?? {})}
				{...otherSlider}
			/>
		</CPopover>
	);
}

export default CSliderSelector;
