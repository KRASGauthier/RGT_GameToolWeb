import { useMemo } from "react";
import {
	CTextFieldOutlinedMultilineStyle,
	type ITextFieldOutlinedMultilineStyle,
} from "../../../style/components/inputs/CTextFieldStyle";
import { sxMerger } from "../../../utils/UStyles";
import type { CTextFieldOutlinedProps } from "./CTextFieldOutlined";
import CTextFieldOutlined from "./CTextFieldOutlined";

export interface CTextFieldOutlinedMultilineProps extends CTextFieldOutlinedProps {
	rows?: number;
}

function CTextFieldOutlinedMultiline({
	xPadding,
	yPadding,

	rows = 3,

	sx,
	...other
}: CTextFieldOutlinedMultilineProps) {
	const style: ITextFieldOutlinedMultilineStyle = useMemo(() => {
		return CTextFieldOutlinedMultilineStyle({ xPadding, yPadding });
	}, [xPadding, yPadding]);

	return (
		<CTextFieldOutlined
			sx={sxMerger(style.main, sx ? sx : {})}
			xPadding={xPadding}
			yPadding={yPadding}
			{...other}
			multiline
			rows={rows}
		></CTextFieldOutlined>
	);
}

export default CTextFieldOutlinedMultiline;
