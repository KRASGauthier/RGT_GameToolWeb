import { useState, type ReactElement } from "react";
import CIconSelector from "../../popover/CIconSelector";
import type { SvgIconProps } from "@mui/material";
import CButtonIcon, { type CButtonIconProps } from "../CButtonIcon";

export interface CIconButtonProps<_T extends string> extends Omit<
	CButtonIconProps,
	"onClick" | "icon"
> {
	library: Record<_T, ReactElement<SvgIconProps>>;
	value: _T;
	onSelected?: (value: _T) => void;
}

function CIconButton<_T extends string>({
	value,
	library,
	onSelected,
	...other
}: CIconButtonProps<_T>) {
	const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

	return (
		<>
			<CIconSelector
				library={library}
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
				onSelected={(value: _T) => {
					setButtonRef(null);
					onSelected?.(value);
				}}
				onClose={() => {
					setButtonRef(null);
				}}
			/>
			<CButtonIcon
				icon={library[value]}
				onClick={(e) => setButtonRef(e.currentTarget)}
				{...other}
			/>
		</>
	);
}

export default CIconButton;
