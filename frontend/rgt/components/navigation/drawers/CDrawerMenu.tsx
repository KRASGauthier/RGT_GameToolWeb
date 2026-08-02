import { useMemo, useState } from "react";
import { sxMerger } from "../../../utils/UStyles";
import CDrawerMini, { type CDrawerMiniProps } from "./CDrawerMini";
import {
	CDrawerMenuStyle,
	type IDrawerMenuStyle,
} from "../../../style/components/navigation/drawers/CDrawerMenuStyle";
import CListMenu from "../../data/lists/CListMenu";
import type { TListMenuCompData } from "../../data/lists/subs/CListMenuComp";
import type { TListMenuGroupData } from "../../data/lists/subs/CListMenuGroup";

export interface CDrawerMenuProps extends CDrawerMiniProps {
	comps: TListMenuCompData[];
	groups: TListMenuGroupData[];

	value?: string;
	onValueChange?: (value: string) => void;
}

function CDrawerMenu({ value, onValueChange, comps, groups, sx, ...other }: CDrawerMenuProps) {

	const [open, setOpen] = useState<boolean>(true);
	const style: IDrawerMenuStyle = useMemo(() => {
		return CDrawerMenuStyle();
	}, []);

	return (
		<CDrawerMini sx={sxMerger(style.main, sx ? sx : {})} onOpen={setOpen} {...other}>
			<CListMenu 
				value={value}
				onValueChange={onValueChange}
				comps={comps}
				groups={groups}
				sx={{ mt: "10px" }}
				small={!open}
				></CListMenu>
		</CDrawerMini>
	);
}

export default CDrawerMenu;
