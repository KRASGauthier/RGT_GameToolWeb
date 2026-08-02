import { appTheme } from "../../../src/style/theme";
import CTextBase, { type CTextBaseProps } from "./CTextBase";

export interface CTextProps extends Omit<CTextBaseProps, "sizeTable" | "fontFamily"> {}

function CText({ ...other }: CTextProps) {
	return (
		<CTextBase
			fontFamily={appTheme.fonts.text.family}
			sizeTable={appTheme.fonts.text.size}
			{...other}
		></CTextBase>
	);
}

export default CText;
