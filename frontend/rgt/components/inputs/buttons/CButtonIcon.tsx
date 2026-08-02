import { memo, type ReactNode } from "react";
import { IconButton, type IconButtonProps } from "@mui/material";
import { CButtonStyle, type IButtonStyle } from "../../../style/components/inputs/CButtonStyle";
import { sxMerger } from "../../../utils/UStyles";
import { CButtonPropCleaner, type CButtonGlobalProps } from "./CButton";

export interface CButtonIconProps extends CButtonGlobalProps, IconButtonProps {
	icon: ReactNode;
}

function CButtonIcon({ icon, sx, ...other }: CButtonIconProps) {
	const style: IButtonStyle = CButtonStyle({ ...other });

	return (
		<IconButton
			sx={sxMerger(style.main, style.icon, sx ? sx : {})}
			{...CButtonPropCleaner(other)}
		>
			{icon}
		</IconButton>
	);
}

export default memo(CButtonIcon);
