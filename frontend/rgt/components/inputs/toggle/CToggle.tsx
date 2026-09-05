import { Stack } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import CButtonIconText from "../buttons/CButtonIconText";
import { CToggleStyle, type IToggleStyle } from "../../../style/components/inputs/CToggleStyle";
import { useMemo, type ReactNode } from "react";
import { sxMerger } from "../../../utils/UStyles";
import type { TSize } from "../../../types/TStyles";
import CText from "../../text/CText";
import type { TButtonStylingTypes } from "../../../style/components/inputs/CButtonStyle";

//--------------------------------------------------
//                     TYPES
//--------------------------------------------------
export interface IToggleEntry {
	value: string;
	display?: string;
	startIcon?: ReactNode;
	endIcon?: ReactNode;
}

//--------------------------------------------------
//                     NODES
//--------------------------------------------------
export interface CToggleProps extends GCompProps {
	label?: string;
	entries: IToggleEntry[];
	value: string;

	//Style
	borderRadius?: TSize;
	borderColor?: string;
	styling?: TButtonStylingTypes;
	checkedStyling?: TButtonStylingTypes;

	onChange?: (value: string) => void;
}

function CToggle({
	label,
	entries,
	value,
	borderRadius,
	borderColor,
	styling,
	checkedStyling,
	onChange,
}: CToggleProps) {
	const style: IToggleStyle = useMemo(() => {
		return CToggleStyle({ borderRadius, borderColor });
	}, [borderRadius, borderColor]);

	return (
		<Stack direction={"column"}>
			{label && (
				<CText size="md" weight={6} sx={{ ml: "3px" }}>
					{label}
				</CText>
			)}
			<Stack sx={{ mt: label ? "5px" : undefined }} direction={"row"}>
				{entries.map((entry: IToggleEntry, index: number) => {
					return (
						<CButtonIconText
							justifyContent="center"
							sx={sxMerger(
								style.button,
								index == 0 ? style.buttonLeft : {},
								index == entries.length - 1 ? style.buttonRight : {},
							)}
							key={entry.value}
							styling={styling}
							checkedStyling={checkedStyling}
							onClick={() => {
								onChange?.(entry.value);
							}}
							checked={entry.value == value}
						>
							{entry.display ?? entry.value}
						</CButtonIconText>
					);
				})}
			</Stack>
		</Stack>
	);
}

export default CToggle;
