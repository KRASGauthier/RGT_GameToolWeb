import { useState } from "react";
import CButtonText, { type CButtonTextProps } from "../buttons/CButtonText";
import type { ISelectorEntry } from "../popover/CSelector";
import CSelector from "../popover/CSelector";

export interface CSelectorButtonProps extends CButtonTextProps {
	values: string[];
	entries: ISelectorEntry[];

	onSelected: (value: string) => void;
	onUnselected: (value: string) => void;
}

function CSelectorButton({
	values,
	entries,
	onSelected,
	onUnselected,
	...other
}: CSelectorButtonProps) {
	const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
	const getText = (): string => {
		let out = "";
		let overflowCount = 0;
		values.forEach((value, index) => {
			if (index < 3)
				out +=
					(out != "" ? ", " : "") +
					(entries.find((entry) => entry.value == value)?.display ?? "null");
			else overflowCount++;
		});
		if (out == "") return "None";
		return out + (overflowCount > 0 ? ", +" + overflowCount : "");
	};

	return (
		<>
			<CButtonText
				sx={{ textTransform: "none" }}
				onClick={(e) => setButtonRef(e.currentTarget)}
				{...other}
			>
				{getText()}
			</CButtonText>
			<CSelector
				anchorEl={buttonRef}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: -4,
					horizontal: "left",
				}}
				onClose={() => setButtonRef(null)}
				open={buttonRef != null}
				values={values}
				entries={entries}
				onSelected={onSelected}
				onUnselected={onUnselected}
			/>
		</>
	);
}

export default CSelectorButton;
