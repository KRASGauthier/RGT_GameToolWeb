import { useMemo, type ReactNode } from "react";
import {
	CListMenuCompStyle,
	type IListMenuCompStyle,
} from "../../../../style/components/data/lists/CListMenuStyle";
import {
	CListItemButton,
	CListItemIcon,
	CListItemText,
	type CListItemButtonProps,
	type CListItemIconProps,
	type CListItemTextProps,
} from "../CList";
import { sxMerger } from "../../../../utils/UStyles";
import CText from "../../../text/CText";
import type { TQuadStyle } from "../../../../types/TStyles";
import type { IThemeColor } from "../../../../types/themeType";

export type TListMenuCompData = {
	value: string;
	display?: string;
	icon?: ReactNode;
	color?: TQuadStyle<string | keyof IThemeColor>;
};

//--------------------------------------------------
//                     ICON
//--------------------------------------------------
export interface CListMenuItemIconProps extends Omit<CListItemIconProps, "style"> {
	style: IListMenuCompStyle;
}
export function CListMenuItemIcon({ style, sx, ...other }: CListMenuItemIconProps) {
	return <CListItemIcon sx={sxMerger(style.itemIcon, sx ? sx : {})} {...other}></CListItemIcon>;
}

//--------------------------------------------------
//                      TEXT
//--------------------------------------------------
export interface CListMenuItemTextProps extends Omit<CListItemTextProps, "style"> {
	style: IListMenuCompStyle;
}
export function CListMenuItemText({ style, sx, ...other }: CListMenuItemTextProps) {
	return <CListItemText sx={sxMerger(style.itemText, sx ? sx : {})} {...other}></CListItemText>;
}

//--------------------------------------------------
//                    BUTTON
//--------------------------------------------------
export interface CListMenuItemButtonProps extends Omit<CListItemButtonProps, "style"> {
	style: IListMenuCompStyle;
}
export function CListMenuItemButton({ style, sx, ...other }: CListMenuItemButtonProps) {
	return (
		<CListItemButton sx={sxMerger(style.itemButton, sx ? sx : {})} {...other}></CListItemButton>
	);
}

//--------------------------------------------------
//                    MAIN
//--------------------------------------------------
export interface CListMenuCompProps extends Omit<CListMenuItemButtonProps, "style"> {
	value: string;
	comp: TListMenuCompData;
	onValueChange?: (value: string) => void;
	small?: boolean;
}
function CListMenuComp({ value, onValueChange, comp, small, sx, ...other }: CListMenuCompProps) {
	const style: IListMenuCompStyle = useMemo(() => {
		return CListMenuCompStyle({ comp, small });
	}, [comp, small]);

	return (
		<CListMenuItemButton
			onClick={() => {
				onValueChange?.(comp.value);
			}}
			selected={value == comp.value}
			style={style}
			sx={sxMerger(style.component, sx ? sx : {})}
			{...other}
		>
			{comp.icon && <CListMenuItemIcon style={style}>{comp.icon}</CListMenuItemIcon>}
			{comp.display && (
				<CListMenuItemText
					style={style}
					disableTypography
					primary={<CText size="sm">{comp.display}</CText>}
				></CListMenuItemText>
			)}
		</CListMenuItemButton>
	);
}

export default CListMenuComp;
