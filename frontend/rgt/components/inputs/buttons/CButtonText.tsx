import { CButtonStyle, type IButtonStyle } from "../../../style/components/inputs/CButtonStyle";
import { useMemo } from "react";
import { sxMerger } from "../../../utils/UStyles";
import type { CButtonProps } from "./CButton";
import CButton from "./CButton";
import CText, { type CTextProps } from "../../text/CText";

export interface CButtonTextProps extends CButtonProps {
	textProps?: CTextProps;
}

function CButtonText({ children, styling = "light", textProps, sx, ...other }: CButtonTextProps) {
	const style: IButtonStyle = useMemo(() => {
		return CButtonStyle({ styling });
	}, [styling]);

	return (
		<CButton styling={styling} sx={sxMerger(style.text, sx ? sx : {})} {...other}>
			<CText
				size={textProps == undefined ? "sm" : textProps.size}
				weight={textProps == undefined ? 5 : textProps.weight}
				{...textProps}
			>
				{children}
			</CText>
		</CButton>
	);
}

export default CButtonText;
