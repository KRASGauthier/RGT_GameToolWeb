import { cloneElement, useMemo, type ReactNode } from "react";
import {
	CButtonIconListStyle,
	type IButtonIconListStyle,
} from "../../../style/components/inputs/buttons/CButtonStyle";
import type { CButtonProps } from "./CButton";
import CButton from "./CButton";
import { Box, Stack } from "@mui/material";
import CText from "../../text/CText";
import { appTheme } from "../../../../src/style/theme";
import type { TIconLibrary } from "../../../../src/types/icons/TIconLibrary";
import { DIconLibraryTsx } from "../../../../src/icons/IIconLibrary";
import { sxMerger } from "../../../util/UStyles";
import CTooltip from "../../feedback/tooltip/CTooltip";
import CAvatar from "../../images/CAvatar";
import type { IUserBase } from "../../../types/data/TUser";

export interface IButtonIconListEntry {
	value: string;
	display?: string;
	icon?: TIconLibrary;
	color?: string;
	user?: IUserBase;
}

export interface CButtonIconListProps extends CButtonProps {
	values: string[];
	entries: IButtonIconListEntry[];

	maxShown?: number;
	emptyText?: string;
	emptyColor?: string;
}

function CButtonIconList({
	entries,
	values,
	maxShown = 3,
	emptyText,
	emptyColor,
	sx,
	...other
}: CButtonIconListProps) {
	//====================== DATA ======================
	const style: IButtonIconListStyle = useMemo(() => {
		return CButtonIconListStyle({});
	}, []);

	//====================== NODES ======================
	const entryNode: ReactNode = useMemo(() => {
		const filtered = entries.filter((entry) => {
			return values.includes(entry.value);
		});
		if (filtered.length == 0)
			return (
				<Box
					key={"none-display"}
					sx={style.node(emptyColor ?? appTheme.colors.primary[5], true, true)}
				>
					<CText size="xs" weight={9} sx={style.extraText}>
						{emptyText ?? "None"}
					</CText>
				</Box>
			);
		const out: ReactNode[] = filtered.map((entry, index): ReactNode => {
			if (index >= maxShown) return;
			if (entry.icon) {
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
			} else if (entry.user) {
				return (
					<CTooltip key={entry.value} title={entry.display ?? entry.value}>
						<CAvatar
							fontSize="xs"
							sx={style.nodeAvatar(index == 0 ? true : false)}
							user={entry.user}
						/>
					</CTooltip>
				);
			}
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
	}, [entries, style, maxShown, values, emptyText, emptyColor]);

	return (
		<CButton
			sx={sxMerger(style.main, sx ?? {})}
			padding={"2px 5px 2px 5px"}
			styling="transparent"
			{...other}
		>
			<Stack sx={style.stack}>{entryNode}</Stack>
		</CButton>
	);
}

export default CButtonIconList;
