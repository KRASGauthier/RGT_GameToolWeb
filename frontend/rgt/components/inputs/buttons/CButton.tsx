import { Button, type ButtonProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import {
	CButtonStyle,
	type IButtonStyle,
	type TButtonStylingTypes,
} from "../../../style/components/inputs/CButtonStyle";
import { memo } from "react";
import { sxMerger } from "../../../utils/UStyles";
import type { TQuadStyle, TSize } from "../../../types/TStyles";

export interface CButtonGlobalProps extends GCompProps {
	elevation?: TQuadStyle<number>;

	styling?: TButtonStylingTypes;
	checkedStyling?: TButtonStylingTypes;
	padding?: TSize;
	borderRadius?: TSize;

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

	return <Button variant="contained" sx={sxMerger(style.main, sx ? sx : {})} {...other}></Button>;
}

export default memo(CButton);
