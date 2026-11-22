import { useMemo, useState } from "react";
import CButtonText, { type CButtonTextProps } from "../CButtonText";
import CSliderSelector from "../../popover/CSliderSelector";
import {
	CSliderButtonStyle,
	type ISliderButtonStyle,
} from "../../../../style/components/inputs/buttons/popover/CSliderButtonStyle";
import { appTheme } from "../../../../../src/style/theme";
import { sxMerger } from "../../../../util/UStyles";

export interface ISliderButtonEntry {
	value: number;
	display?: string;
	color?: string;
}

export interface CSliderButtonProps extends Omit<
	CButtonTextProps,
	"onClick" | "icon" | "onChange"
> {
	value: number;
	entries: ISliderButtonEntry[];

	onChange?: (value: number) => void;
}

function CSliderButton({ entries, value, onChange, sx, ...other }: CSliderButtonProps) {
	const style: ISliderButtonStyle = useMemo(() => {
		return CSliderButtonStyle({
			color:
				entries.find((entry) => {
					return entry.value == value;
				})?.color ?? appTheme.colors.primary[5],
		});
	}, [entries, value]);
	const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

	const min = entries.reduce((last, current) =>
		current.value < last.value ? current : last,
	).value;
	const max = entries.reduce((last, current) =>
		current.value > last.value ? current : last,
	).value;
	const current = entries.find((entry) => {
		return entry.value == value;
	});

	return (
		<>
			<CSliderSelector
				anchorEl={buttonRef}
				anchorOrigin={{
					vertical: -4,
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				open={buttonRef != null}
				onClose={() => {
					setButtonRef(null);
				}}
				sliderProps={{
					min,
					max,
					step: 1,
				}}
				onChange={onChange}
				value={value}
			/>
			<CButtonText
				sx={sxMerger(style.main, sx ?? {})}
				onClick={(e) => setButtonRef(e.currentTarget)}
				{...other}
			>
				{current?.display ?? "None"}
			</CButtonText>
		</>
	);
}

export default CSliderButton;
