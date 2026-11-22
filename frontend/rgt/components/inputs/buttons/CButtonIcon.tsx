import { cloneElement, memo, type ReactElement } from "react";
import { IconButton, type IconButtonProps, type SvgIconProps } from "@mui/material";
import {
	CButtonIconStyle,
	CButtonStyle,
	type IButtonIconStyle,
	type IButtonStyle,
} from "../../../style/components/inputs/buttons/CButtonStyle";
import { sxMerger } from "../../../util/UStyles";
import { CButtonPropCleaner, type CButtonGlobalProps } from "./CButton";
import type { TFontSize } from "../../../types/themeType";
import type { TIconLibrary } from "../../../../src/types/icons/TIconLibrary";
import { DIconLibraryTsx } from "../../../../src/icons/IIconLibrary";

export interface CButtonIconProps extends CButtonGlobalProps, Omit<IconButtonProps, "size"> {
	icon: ReactElement<SvgIconProps> | TIconLibrary;
	size?: TFontSize;
}

function CButtonIcon({
	icon,
	size,
	padding,
	sx,
	borderRadius,
	noPropagation,
	onClick,
	...other
}: CButtonIconProps) {
	const baseStyle: IButtonStyle = CButtonStyle({ padding, borderRadius, ...other });
	const style: IButtonIconStyle = CButtonIconStyle({ size, padding, borderRadius });

	const currentIcon: ReactElement<SvgIconProps> =
		typeof icon == "string" ? DIconLibraryTsx[icon] : icon;
	const finalIcon: ReactElement = cloneElement(currentIcon, {
		sx: sxMerger(currentIcon.props.sx ?? {}, style.icon),
	});

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (noPropagation) event.stopPropagation();
		onClick?.(event);
	};

	return (
		<IconButton
			onClick={handleClick}
			sx={sxMerger(baseStyle.main, style.main, sx ? sx : {})}
			{...CButtonPropCleaner(other)}
		>
			{finalIcon}
		</IconButton>
	);
}

export default memo(CButtonIcon);
