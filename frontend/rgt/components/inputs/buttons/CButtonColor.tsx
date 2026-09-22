import { sxMerger } from "../../../utils/UStyles";
import CButton, { type CButtonProps } from "./CButton";
import {
	CButtonColorStyle,
	type IButtonColorStyle,
} from "../../../style/components/inputs/CButtonStyle";
import { useMemo, useState } from "react";
import { appTheme } from "../../../../src/style/theme";
import CColorSelector from "../popover/CColorSelector";

export interface CButtonColorProps extends Omit<CButtonProps, "onClick" | "onChange" | "color"> {
	color?: string;
	defaultColor?: string;
	onChange?: (color: string) => void;
}

function CButtonColor({ color, defaultColor, onChange, sx, ...other }: CButtonColorProps) {
	const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
	const [localColor, setLocalColor] = useState<string>(
		defaultColor ?? appTheme.colors.primary[5],
	);
	const activeColor = color ?? localColor;

	//====================== DATA ======================
	const style: IButtonColorStyle = useMemo(() => {
		return CButtonColorStyle({ color: activeColor });
	}, [activeColor]);

	//====================== HANDLERS ======================
	const handleChange = (color: string) => {
		setLocalColor(color);
		onChange?.(color);
	};

	//====================== NODES ======================
	return (
		<>
			<CButton
				sx={sxMerger(style.main, sx ?? {})}
				onClick={(e) => setButtonRef(e.currentTarget)}
				{...other}
			></CButton>
			<CColorSelector
				defaultColor={activeColor}
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
				onSelected={(value: string) => {
					setButtonRef(null);
					handleChange(value);
				}}
				onCancelled={() => {
					setButtonRef(null);
				}}
			/>
		</>
	);
}

export default CButtonColor;
