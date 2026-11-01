import { cloneElement, useMemo, useState, type ReactNode } from "react";
import type { ISelectorEntry } from "../popover/CSelector";
import CSelector from "../popover/CSelector";
import { Box, Stack } from "@mui/material";
import { DIconLibraryTsx } from "../../../../src/icons/IIconLibrary";
import {
	CSelectorButtonIconStyle,
	type ISelectorButtonIconStyle,
} from "../../../style/components/selectors/CSelectorButtonIconStyle";
import { sxMerger } from "../../../utils/UStyles";
import { appTheme } from "../../../../src/style/theme";
import CTooltip from "../../feedback/tooltip/CTooltip";
import CText from "../../text/CText";
import CButton, { type CButtonProps } from "../buttons/CButton";

export interface CSelectorButtonIconProps extends CButtonProps {
	values: string[];
	entries: ISelectorEntry[];

	maxShown?: number;

	onSelected: (value: string) => void;
	onUnselected: (value: string) => void;
}

function CSelectorButtonIcon({
	values,
	entries,
	maxShown = 3,
	onSelected,
	onUnselected,
	...other
}: CSelectorButtonIconProps) {
	const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
	const style: ISelectorButtonIconStyle = useMemo(() => {
		return CSelectorButtonIconStyle({});
	}, []);

	const entryNode: ReactNode = useMemo(() => {
		const filtered = entries.filter((entry) => {
			return values.includes(entry.value);
		});
		if (filtered.length == 0)
			return (
				<Box key={"none-display"} sx={style.node(appTheme.colors.primary[5], true, true)}>
					<CText size="xs" weight={9} sx={style.extraText}>
						None
					</CText>
				</Box>
			);
		const out: ReactNode[] = filtered.map((entry, index): ReactNode => {
			if (!entry.icon || index >= maxShown) return;
			const icon = cloneElement(DIconLibraryTsx[entry.icon], {
				sx: sxMerger(DIconLibraryTsx[entry.icon].props.sx ?? {}, {
					fontSize: appTheme.fonts.text.size["lg"],
				}),
			});
			return (
				<CTooltip key={entry.value} title={entry.display ?? entry.value}>
					<Box sx={style.node(entry.color ?? "#000000", index == 0 ? true : false)}>
						{icon}
					</Box>
				</CTooltip>
			);
		});
		if (filtered.length - maxShown > 0)
			out.push(
				<Box key={"max-display"} sx={style.node(appTheme.colors.primary[5], false)}>
					<CText size="xs" weight={9} sx={style.extraText}>
						+{filtered.length - maxShown}
					</CText>
				</Box>,
			);
		return out;
	}, [entries, style, maxShown, values]);

	return (
		<>
			<CButton
				sx={style.main}
				padding={"2px 5px 2px 5px"}
				styling="transparent"
				onClick={(e) => setButtonRef(e.currentTarget)}
				{...other}
			>
				<Stack sx={style.stack}>{entryNode}</Stack>
			</CButton>
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
