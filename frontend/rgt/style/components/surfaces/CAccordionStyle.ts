import type { SxProps, Theme} from "@mui/material";
import type { TSize } from "../../../types/TStyles";
import { sizeToString } from "../../../util/UStyles";
import { appTheme } from "../../../../src/style/theme";

export interface IAccordionStyle {
	header: SxProps<Theme>;
	bottom: SxProps<Theme>;
}

export interface CAccordionStyleProps {
	open: boolean
	borderRadius: TSize
}

export const CAccordionStyle = ({open,borderRadius}: CAccordionStyleProps): IAccordionStyle => {
	return {
		header: {
			borderRadius: `${sizeToString(borderRadius)} ${sizeToString(borderRadius)} ${open ? "0px" : sizeToString(borderRadius)} ${open ? "0px" : sizeToString(borderRadius)}`,

			transition: (theme: Theme): string =>
				theme.transitions.create(["border-radius"], {
					duration: appTheme.animations.timing.medium_fast,
			}),
		},
		bottom: {
			minHeight: "100px",
			borderRadius: `0px 0px ${sizeToString(borderRadius)} ${sizeToString(borderRadius)}`
		}
	}
}