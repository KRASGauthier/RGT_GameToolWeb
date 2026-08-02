import { appTheme } from "../../../src/style/theme";
import CTextBase, { type CTextBaseProps } from "./CTextBase";

export interface CTitleProps extends Omit<CTextBaseProps, "sizeTable" | "fontFamily"> {}

function CTitle({ ...other }: CTitleProps) {
	return (
		<CTextBase
			fontFamily={appTheme.fonts.title.family}
			sizeTable={appTheme.fonts.title.size}
			{...other}
		></CTextBase>
	);
}

export default CTitle;
