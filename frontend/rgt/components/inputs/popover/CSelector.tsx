import { useMemo, useState } from "react";
import type { TIconLibrary } from "../../../../src/types/icons/TIconLibrary";
import CPopover, { type CPopoverProps } from "../../feedback/popover/CPopover";
import {
	CSelectorStyle,
	type ISelectorStyle,
} from "../../../style/components/inputs/popover/CSelectorStyle";
import { Stack } from "@mui/material";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import CButtonIconText from "../buttons/CButtonIconText";
import CStack from "../../layout/CStack";
import { DIconLibraryTsx } from "../../../../src/icons/IIconLibrary";

export interface ISelectorEntry {
	value: string;
	display?: string;
	icon?: TIconLibrary;
	color?: string;
}

export interface CSelectorProps extends CPopoverProps {
	values: string[];
	entries: ISelectorEntry[];

	onSelected: (value: string) => void;
	onUnselected: (value: string) => void;
}

function CSelector({ values, entries, onSelected, onUnselected, ...other }: CSelectorProps) {
	const style: ISelectorStyle = useMemo(() => {
		return CSelectorStyle({});
	}, []);
	const [filter, setFilter] = useState<string>("");

	const entryNodes = useMemo(() => {
		return entries.map((entry: ISelectorEntry) => {
			if (
				filter != "" &&
				!(
					entry.value.toLocaleLowerCase().includes(filter.toLowerCase()) ||
					(entry.display &&
						entry.display.toLocaleLowerCase().includes(filter.toLowerCase()))
				)
			)
				return;
			return (
				<CButtonIconText
					styling="dark"
					sx={style.button(values.includes(entry.value), entry.color)}
					checkedStyling="checked-light"
					key={entry.value}
					borderRadius={"tiny"}
					checked={values.includes(entry.value)}
					onClick={() => {
						values.includes(entry.value)
							? onUnselected(entry.value)
							: onSelected(entry.value);
					}}
					justifyContent="flex-start"
					spacing={"5px"}
					padding={"4px 10px"}
					startIcon={entry.icon ? DIconLibraryTsx[entry.icon] : undefined}
					endIcon={values.includes(entry.value) ? DIconLibraryTsx["tick"] : undefined}
					textProps={{ sx: { flex: 1, textAlign: "left" } }}
				>
					{entry.display ?? entry.value}
				</CButtonIconText>
			);
		});
	}, [entries, values, onUnselected, onSelected, filter, style]);

	return (
		<CPopover sx={style.main} {...other}>
			<Stack>
				<CTextFieldOutlined
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					sx={{ my: "5px" }}
					yPadding={"5px"}
				/>
				<CStack
					spacing={"2px"}
					sx={{
						px: "2px",
						py: "2px",
						minWidth: "250px",
						minHeight: "100px",
						maxHeight: "200px",
					}}
					borderRadius={"small"}
					styling="deep"
				>
					{entryNodes}
				</CStack>
			</Stack>
		</CPopover>
	);
}

export default CSelector;
