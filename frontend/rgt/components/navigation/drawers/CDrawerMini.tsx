import { useEffect, useMemo, useState } from "react";
import { sxMerger } from "../../../utils/UStyles";
import {
	CDrawerMiniStyle,
	type IDrawerMiniStyle,
} from "../../../style/components/navigation/drawers/CDrawerMiniStyle";
import type { GCompProps } from "../../shared/ccommon";
import { Box, Stack, type BoxProps } from "@mui/material";
import type { TQuadStyle } from "../../../types/TStyles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CButtonIconText from "../../inputs/buttons/CButtonIconText";

export interface CDrawerMiniProps extends GCompProps, BoxProps {
	elevation?: TQuadStyle<number>;
	drawerName?: string;

	openWidth?: number;
	closedWidth?: number;

	onOpen?: (open: boolean) => void;

	saveStatus?: boolean;
}

const OPEN_STORAGE_KEY = "CDrawerMiniOpen";

function CDrawerMini({
	elevation,
	drawerName,
	openWidth = 200,
	closedWidth = 50,
	onOpen,
	children,
	saveStatus,
	sx,
	...other
}: CDrawerMiniProps) {
	const [open, setOpen] = useState<boolean>(() => {
		return localStorage.getItem(OPEN_STORAGE_KEY) == null ||
			localStorage.getItem(OPEN_STORAGE_KEY) == "closed"
			? false
			: true;
	});
	const style: IDrawerMiniStyle = useMemo(() => {
		return CDrawerMiniStyle({ elevation, open, openWidth, closedWidth });
	}, [elevation, open, openWidth, closedWidth]);

	useEffect(() => {
		if (saveStatus) localStorage.setItem(OPEN_STORAGE_KEY, open ? "open" : "closed");
		onOpen?.(open);
	}, [open, saveStatus, onOpen]);

	return (
		<Box sx={sxMerger(style.main, sx ? sx : {})} {...other}>
			<Stack sx={{ position: "absolute", inset: 0 }}>
				<CButtonIconText
					onClick={() => {
						onOpen?.(!open);
						setOpen(!open);
					}}
					sx={style.button}
					startIcon={
						open ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />
					}
					iconOnly={!open}
					justifyContent={"center"}
					styling="dark"
				>
					{drawerName ? drawerName : "Close"}
				</CButtonIconText>
				{children}
			</Stack>
		</Box>
	);
}

export default CDrawerMini;
