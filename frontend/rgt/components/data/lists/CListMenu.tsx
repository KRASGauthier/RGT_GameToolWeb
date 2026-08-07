import { useMemo } from "react";
import { sxMerger } from "../../../utils/UStyles";
import type { CListProps } from "./CList";
import {
	CListMenuStyle,
	type IListMenuStyle,
} from "../../../style/components/data/lists/CListMenuStyle";
import CList from "./CList";
import type { TListMenuCompData } from "./subs/CListMenuComp";
import type { TListMenuGroupData } from "./subs/CListMenuGroup";
import CListMenuComp from "./subs/CListMenuComp";
import CListMenuGroup from "./subs/CListMenuGroup";

export interface CListMenuProps extends CListProps {
	comps: TListMenuCompData[];
	groups: TListMenuGroupData[];

	value?: string;
	onValueChange?: (value: string) => void;

	small?: boolean;
}

function CListMenu({
	value = "",
	onValueChange,
	comps,
	groups,
	small,
	sx,
	...other
}: CListMenuProps) {
	const style: IListMenuStyle = useMemo(() => {
		return CListMenuStyle();
	}, []);

	return (
		<CList sx={sxMerger(style.main, sx ? sx : {})} {...other}>
			{comps.map((comp: TListMenuCompData) => {
				return (
					<CListMenuComp
						small={small}
						onValueChange={onValueChange}
						value={value}
						comp={comp}
					/>
				);
			})}
			{groups.map((group: TListMenuGroupData) => {
				return (
					<CListMenuGroup
						small={small}
						onValueChange={onValueChange}
						value={value}
						group={group}
					/>
				);
			})}
		</CList>
	);
}

export default CListMenu;
