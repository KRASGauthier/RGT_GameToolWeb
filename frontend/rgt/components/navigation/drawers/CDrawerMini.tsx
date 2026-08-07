import { useMemo, useState } from "react";
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
}

function CDrawerMini({
	elevation,
	drawerName,
	openWidth = 200,
	closedWidth = 50,
	onOpen,
	children,
	sx,
	...other
}: CDrawerMiniProps) {
	const [open, setOpen] = useState<boolean>(true);
	const style: IDrawerMiniStyle = useMemo(() => {
		return CDrawerMiniStyle({ elevation, open, openWidth, closedWidth });
	}, [elevation, open, openWidth, closedWidth]);

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
