import { useMemo, useState } from "react";
import CSelector from "../popover/CSelector";
import {
	CSelectorButtonIconStyle,
	type ISelectorButtonIconStyle,
} from "../../../style/components/selectors/CSelectorButtonIconStyle";
import CButtonIconList, { type CButtonIconListProps } from "../buttons/CButtonIconList";

export interface CSelectorButtonIconProps extends CButtonIconListProps {
	onSelected: (value: string) => void;
	onUnselected: (value: string) => void;
}

function CSelectorButtonIcon({
	values,
	entries,
	onSelected,
	onUnselected,
	...other
}: CSelectorButtonIconProps) {
	const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
	const style: ISelectorButtonIconStyle = useMemo(() => {
		return CSelectorButtonIconStyle({});
	}, []);

	return (
		<>
			<CButtonIconList
				values={values}
				entries={entries}
				sx={style.main}
				onClick={(e) => setButtonRef(e.currentTarget)}
				{...other}
			/>
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

export default CSelectorButtonIcon;
