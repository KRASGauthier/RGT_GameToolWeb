import { Collapse, Stack } from "@mui/material";
import {
	CListMenuGroupStyle,
	type IListMenuGroupStyle,
} from "../../../../style/components/data/lists/CListMenuStyle";
import CList, { CListItemButton, CListItemIcon, CListItemText, type CListProps } from "../CList";
import { sxMerger } from "../../../../utils/UStyles";
import CListMenuComp, { type TListMenuCompData } from "./CListMenuComp";
import { cloneElement, useMemo, useState, type ReactElement } from "react";
import type { TQuadStyle } from "../../../../types/TStyles";
import type { IThemeColor } from "../../../../types/themeType";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CText from "../../../text/CText";

//====================== TYPES ======================
export type TListMenuGroupData = {
	value: string;
	display?: string;
	comps: TListMenuCompData[];
	color?: TQuadStyle<string | keyof IThemeColor>;
	icon?: ReactElement;
};

//====================== LOCAL STORAGE ======================
const LS_GROUP_OPEN_SUFFIX = "-Opens";
type TLSListOpens = Record<string, boolean>;
function setGroupState(saveID: string, name: string, status: boolean) {
	const data: TLSListOpens = JSON.parse(
		localStorage.getItem(saveID + LS_GROUP_OPEN_SUFFIX) ?? "{}",
	);
	data[name] = status;
	localStorage.setItem(saveID + LS_GROUP_OPEN_SUFFIX, JSON.stringify(data));
}
function getGroupState(saveID: string, name: string): boolean {
	const data: TLSListOpens = JSON.parse(
		localStorage.getItem(saveID + LS_GROUP_OPEN_SUFFIX) ?? "{}",
	);
	return data[name] ?? false;
}

//====================== NODE ======================
export interface CListMenuGroupProps extends CListProps {
	value: string;
	group: TListMenuGroupData;
	onValueChange?: (value: string) => void;
	small?: boolean;
}

function CListMenuGroup({
	value,
	onValueChange,
	group,
	small,
	saveID,
	sx,
	...other
}: CListMenuGroupProps) {
	const [open, setOpen] = useState<boolean>(saveID ? getGroupState(saveID, group.value) : true);
	const style: IListMenuGroupStyle = useMemo(() => {
		return CListMenuGroupStyle({ group, small });
	}, [group, small]);

	const iconFinal: ReactElement | undefined = group.icon
		? cloneElement(group.icon, {})
		: undefined;

	return (
		<>
			<Stack>
				<CListItemButton
					onClick={() => {
						setOpen(!open);
						if (saveID) setGroupState(saveID, group.value, !open);
					}}
					sx={style.groupItemButton}
				>
					{iconFinal && small && (
						<CListItemIcon sx={style.groupItemIcon}>{iconFinal}</CListItemIcon>
					)}
					{group.display && !small && (
						<CListItemText
							sx={style.groupItemText}
							disableTypography
							primary={<CText size="md">{group.display}</CText>}
						></CListItemText>
					)}
					{open ? (
						<ExpandMore sx={{ fontSize: "20px" }} />
					) : (
						<ExpandLess sx={{ fontSize: "20px" }} />
					)}
				</CListItemButton>
			</Stack>
			<Collapse in={open}>
				<CList sx={sxMerger(style.group, sx ? sx : {})} {...other}>
					{group.comps.map((comp: TListMenuCompData, index: number) => {
						comp.color = comp.color ? comp.color : group.color;
						return (
							<CListMenuComp
								key={comp.value + "-" + index}
								onValueChange={onValueChange}
								value={value}
								comp={comp}
								small={small}
							></CListMenuComp>
						);
					})}
				</CList>
			</Collapse>
		</>
	);
}

export default CListMenuGroup;
