import { FormControl, InputLabel, MenuItem, Select, type SelectProps } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import type { TFontSize } from "../../../types/themeType";
import { sxMerger } from "../../../utils/UStyles";
import { memo, useId } from "react";
import {
	CSelectOutlinedStyle,
	type ISelectSOutlinedStyle,
} from "../../../style/components/inputs/CSelectStyle";
import type { CInputOutlinedStyling } from "../../../style/components/inputs/sharedStyle";
import type { TQuadStyle } from "../../../types/TStyles";

export interface CSelectOutlinedProps extends GCompProps, Omit<SelectProps, "variant"> {
	selection: {
		value: string | number;
		display: string;
	}[];
	label?: string;

	styling?: CInputOutlinedStyling;

	elevation?: TQuadStyle<number>;

	fontSize?: TFontSize;
	weight?: number;
	fontFamily?: string;

	borderRadius?: string | number;
	borderWidth?: string | number;

	xPadding?: string | number;
	yPadding?: string | number;
}

function CSelectOutlined({ selection, label, sx, ...other }: CSelectOutlinedProps) {
	const style: ISelectSOutlinedStyle = CSelectOutlinedStyle({ ...other });

	const id = useId();

	return (
		<FormControl variant="outlined">
			{label != undefined && (
				<InputLabel sx={style.label} id={id + "-label"}>
					{label}
				</InputLabel>
			)}
			<Select
				labelId={label == undefined ? undefined : id + "-label"}
				id={id + "-selet"}
				sx={sxMerger(style.main, sx ? sx : {})}
				label={label}
				{...other}
			>
				{selection.map((selecting) => {
					return (
						<MenuItem key={selecting.value} value={selecting.value}>
							{selecting.display}
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
}

export default memo(CSelectOutlined);
