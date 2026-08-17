import { Button, type ButtonProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import { CButtonStyle, type IButtonStyle } from "../../../style/components/inputs/CButtonStyle";
import { memo } from "react";
import { sxMerger } from "../../../utils/UStyles";
import type { TQuadStyle, TSize } from "../../../types/TStyles";

export type TButtonStylingTypes = "dark" | "medium" | "light" | "validate" | "cancel";
export interface CButtonGlobalProps extends GCompProps {
	bgColor?: string[];
	bgColorHover?: string[];
	bgColorDisabled?: string[];

	elevation?: TQuadStyle<number>;

	textColor?: string;
	textHoverColor?: string;

	styling?: TButtonStylingTypes;
	padding?: TSize;

	checked?: boolean;
}

export const CButtonPropCleaner = <_In extends CButtonGlobalProps>(other: _In) => {
	const cleanedVersion = other;

	[
		"bgColor",
		"bgColorHover",
		"bgColorDisabled",
		"elevation",
		"textColor",
		"textHoverColor",
		"styling",
		"padding",
		"checked",
	].forEach((key) => {
		Reflect.deleteProperty(cleanedVersion, key);
	});
	return cleanedVersion;
};

export interface CButtonProps extends CButtonGlobalProps, ButtonProps {}

function CButton({ sx, ...other }: CButtonProps) {
	const style: IButtonStyle = CButtonStyle({ ...other });

	return <Button variant="contained" sx={sxMerger(style.main, sx ? sx : {})} {...other}></Button>;
}

export default memo(CButton);
