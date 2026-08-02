import { Drawer, type DrawerProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import {
	CDrawerStyle,
	type IDrawerStyle,
} from "../../../style/components/navigation/drawers/CDrawerStyle";
import { useMemo } from "react";
import { sxMerger } from "../../../utils/UStyles";

export interface CDrawerProps extends GCompProps, DrawerProps {}

function CDrawer({ sx, ...other }: CDrawerProps) {
	const style: IDrawerStyle = useMemo(() => {
		return CDrawerStyle();
	}, []);

	return <Drawer sx={sxMerger(style.main, sx ? sx : {})} {...other}></Drawer>;
}

export default CDrawer;
