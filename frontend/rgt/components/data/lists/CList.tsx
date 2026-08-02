import {
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	type ListItemButtonProps,
	type ListItemIconProps,
	type ListItemTextProps,
	type ListProps,
} from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import { CListStyle, type IListStyle } from "../../../style/components/data/lists/CListStyle";
import { useMemo } from "react";
import { sxMerger } from "../../../utils/UStyles";

//--------------------------------------------------
//                      ICON
//--------------------------------------------------
export interface CListItemIconProps extends GCompProps, ListItemIconProps {}
export function CListItemIcon({ sx, ...other }: CListItemIconProps) {
	const style: IListStyle = useMemo(() => {
		return CListStyle();
	}, []);

	return <ListItemIcon sx={sxMerger(style.itemIcon, sx ? sx : {})} {...other}></ListItemIcon>;
}

//--------------------------------------------------
//                      TEXT
//--------------------------------------------------
export interface CListItemTextProps extends GCompProps, ListItemTextProps {}
export function CListItemText({ sx, ...other }: CListItemTextProps) {
	const style: IListStyle = useMemo(() => {
		return CListStyle();
	}, []);

	return <ListItemText sx={sxMerger(style.itemText, sx ? sx : {})} {...other}></ListItemText>;
}

//--------------------------------------------------
//                      BUTTON
//--------------------------------------------------
export interface CListItemButtonProps extends GCompProps, ListItemButtonProps {}
export function CListItemButton({ sx, ...other }: CListItemButtonProps) {
	const style: IListStyle = useMemo(() => {
		return CListStyle();
	}, []);

	return (
		<ListItemButton sx={sxMerger(style.itemButton, sx ? sx : {})} {...other}></ListItemButton>
	);
}

//--------------------------------------------------
//                     MAIN
//--------------------------------------------------
export interface CListProps extends GCompProps, ListProps {}
function CList({ sx, ...other }: CListProps) {
	const style: IListStyle = useMemo(() => {
		return CListStyle();
	}, []);

	return <List sx={sxMerger(style.main, sx ? sx : {})} {...other}></List>;
}

export default CList;
