import { CButtonStyle, type IButtonStyle } from "../../../style/components/inputs/CButtonStyle";
import { cloneElement, useMemo, type ReactElement, } from "react";
import { sxMerger } from "../../../utils/UStyles";
import type { CButtonProps } from "./CButton";
import CButton from "./CButton";
import CText, { type CTextProps } from "../../text/CText";
import { Stack, type SvgIconProps } from "@mui/material";
import type { SystemCssProperties } from "@mui/system";
import type { Theme } from "@mui/material";

export interface CButtonIconTextProps extends Omit<CButtonProps, "startIcon" | "endIcon"> {
	textProps?: CTextProps;
	startIcon?: ReactElement<SvgIconProps>;
	endIcon?: ReactElement<SvgIconProps>;

	justifyContent?: SystemCssProperties<Theme>["justifyContent"];
	iconOnly?: boolean;
}

function CButtonIconText({
	startIcon,
	endIcon,
	justifyContent,
	iconOnly,
	children,
	lighting = "light",
	textProps,
	sx,
	...other
}: CButtonIconTextProps) {
	const style: IButtonStyle = useMemo(() => {
		return CButtonStyle({ lighting });
	}, [lighting]);

	const startIconFinal: ReactElement | undefined =
		startIcon == undefined
			? undefined
			: cloneElement(startIcon, {
					sx: sxMerger({}, startIcon.props.sx ? startIcon.props.sx : {}),
				});

	const endIconFinal: ReactElement | undefined =
		endIcon == undefined
			? undefined
			: cloneElement(endIcon, {
					sx: sxMerger({}, endIcon.props.sx ? endIcon.props.sx : {}),
				});

	return (
		<CButton lighting={lighting} sx={sxMerger(style.text, sx ? sx : {})} {...other}>
			<Stack
				direction={"row"}
				sx={{
					flex: 1,
					alignItems: "center",
					justifyContent: justifyContent ? justifyContent : "space-between",
					minWidth: 0,
				}}
			>
				{startIconFinal}
				{!iconOnly && (
					<CText
						size={textProps == undefined ? "sm" : textProps.size}
						weight={textProps == undefined ? 5 : textProps.weight}
						{...textProps}
					>
						{children}
					</CText>
				)}
				{endIconFinal}
			</Stack>
		</CButton>
	);
}

export default CButtonIconText;
