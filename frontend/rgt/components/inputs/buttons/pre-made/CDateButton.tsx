import { useState } from "react";
import CDateSelector from "../../popover/CDateSelector";
import type { CButtonIconTextProps } from "../CButtonIconText";
import CButtonIconText from "../CButtonIconText";

export interface CDateButtonProps extends Omit<CButtonIconTextProps, "value" | "onChange"> {
	value: Date;
	onChange?: (date: Date) => void;
}

function CDateButton({ value, onChange, ...other }: CDateButtonProps) {
	const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

	return (
		<>
			<CDateSelector
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

				value={value}
				onChange={(date: Date) => {
					setButtonRef(null);
					onChange?.(date);
				}}
			/>
			<CButtonIconText {...other} onClick={(e) => setButtonRef(e.currentTarget)}>
				{value.toLocaleDateString()}
			</CButtonIconText>
		</>
	);
}

export default CDateButton;
