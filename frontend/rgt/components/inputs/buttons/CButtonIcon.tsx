import { cloneElement, memo, type ReactElement } from "react";
import { IconButton, type IconButtonProps, type SvgIconProps } from "@mui/material";
import {
	CButtonIconStyle,
	CButtonStyle,
	type IButtonIconStyle,
	type IButtonStyle,
} from "../../../style/components/inputs/CButtonStyle";
import { sxMerger } from "../../../utils/UStyles";
import { CButtonPropCleaner, type CButtonGlobalProps } from "./CButton";
import type { TFontSize } from "../../../types/themeType";

export interface CButtonIconProps extends CButtonGlobalProps, Omit<IconButtonProps, "size"> {
	icon: ReactElement<SvgIconProps>;
	size?: TFontSize;
}

function CButtonIcon({ icon, size, padding, sx, ...other }: CButtonIconProps) {
	const baseStyle: IButtonStyle = CButtonStyle({ padding, ...other });
	const style: IButtonIconStyle = CButtonIconStyle({ size, padding });

	const finalIcon: ReactElement = cloneElement(icon, {
		sx: sxMerger(icon.props.sx ?? {}, style.icon),
	});

	return (
		<IconButton
			sx={sxMerger(baseStyle.main, style.main, sx ? sx : {})}
			{...CButtonPropCleaner(other)}
		>
			{finalIcon}
		</IconButton>
	);
}

export default memo(CButtonIcon);
