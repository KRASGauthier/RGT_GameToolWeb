import { useState } from "react";
import CIconSelector from "../../popover/CIconSelector";
import CButtonIcon, { type CButtonIconProps } from "../CButtonIcon";
import type { TIconLibrary } from "../../../../../src/types/icons/TIconLibrary";
import { DIconLibraryTsx } from "../../../../../src/icons/IIconLibrary";

export interface CIconButtonProps extends Omit<CButtonIconProps, "onClick" | "icon"> {
	value: TIconLibrary;
	onSelected?: (value: TIconLibrary) => void;
}

function CIconButton({ value, onSelected, ...other }: CIconButtonProps) {
	const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

	return (
		<>
			<CIconSelector
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
				onSelected={(value: TIconLibrary) => {
					setButtonRef(null);
					onSelected?.(value);
				}}
				onClose={() => {
					setButtonRef(null);
				}}
			/>
			<CButtonIcon
				icon={DIconLibraryTsx[value]}
				onClick={(e) => setButtonRef(e.currentTarget)}
				{...other}
			/>
		</>
	);
}

export default CIconButton;
