import { Button, type ButtonProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import {
	CButtonStyle,
	type IButtonStyle,
	type TButtonStylingTypes,
} from "../../../style/components/inputs/buttons/CButtonStyle";
import React, { memo } from "react";
import { sxMerger } from "../../../util/UStyles";
import type { TQuadStyle, TSize } from "../../../types/TStyles";
import type { TThemeRadius } from "../../../types/themeType";

export interface CButtonGlobalProps extends GCompProps {
	elevation?: TQuadStyle<number>;

	styling?: TButtonStylingTypes;
	checkedStyling?: TButtonStylingTypes;
	padding?: TSize;
	borderRadius?: TSize | TThemeRadius;

	checked?: boolean;
}

export const CButtonPropCleaner = <_In extends CButtonGlobalProps>(other: _In) => {
	const cleanedVersion = other;

	["elevation", "styling", "checkedStyling", "padding", "checked"].forEach((key) => {
		Reflect.deleteProperty(cleanedVersion, key);
	});
	return cleanedVersion;
};

export interface CButtonProps extends CButtonGlobalProps, ButtonProps {}

function CButton({
	elevation,
	styling,
	checkedStyling,
	padding,
	borderRadius,
	checked,
	sx,

	noPropagation,
	onClick,

	...other
}: CButtonProps) {
	const style: IButtonStyle = CButtonStyle({
		elevation,
		styling,
		checkedStyling,
		padding,
		borderRadius,
		checked,
	});

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (noPropagation) event.stopPropagation();
		onClick?.(event);
	};

	return (
		<Button
			variant="contained"
			onClick={handleClick}
			sx={sxMerger(style.main, sx ? sx : {})}
			{...other}
		></Button>
	);
}

export default memo(CButton);
