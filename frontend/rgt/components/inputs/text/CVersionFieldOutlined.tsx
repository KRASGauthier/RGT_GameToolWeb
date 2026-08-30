import type { GCompProps } from "../../shared/ccommon";
import { useMemo } from "react";
import {
	CVersionFieldOutlinedStyle,
	type IVersionFieldOutlinedStyle,
} from "../../../style/components/inputs/CTextFieldStyle";
import type { CTextFieldOutlinedProps } from "./CTextFieldOutlined";
import { Stack } from "@mui/material";
import CText from "../../text/CText";
import CTextFieldOutlined from "./CTextFieldOutlined";
import { appTheme } from "../../../../src/style/theme";
import type { IVersion, TVersionType } from "../../../types/TShared";
import { sxMerger } from "../../../utils/UStyles";

const MAX_INPUT = 7;
export interface CVersionFieldOutlinedProps
	extends GCompProps, Omit<CTextFieldOutlinedProps, "label" | "onChange" | "required"> {
	value: IVersion;
	required?: boolean;

	label?: string;
	filled?: boolean;

	onChange?: (version: IVersion) => void;
}

function CVersionFieldOutlined({
	value,
	required,
	label,
	filled,
	onChange,
	sx,
	...other
}: CVersionFieldOutlinedProps) {
	const style: IVersionFieldOutlinedStyle = useMemo(() => {
		return CVersionFieldOutlinedStyle({ filled });
	}, [filled]);

	const updateVersion = (target: TVersionType, nValue: string) => {
		nValue.replaceAll(/[^0-9]/g, "");
		if (nValue.length > MAX_INPUT) nValue = nValue.slice(0, MAX_INPUT);

		onChange?.({
			...value,
			[target]: !nValue ? 0 : parseInt(nValue),
		});
	};

	return (
		<Stack direction={"column"}>
			{label && (
				<CText weight={5} size="md">
					{label}
				</CText>
			)}
			<Stack
				sx={{ mt: label ? "7px" : 0 }}
				spacing={appTheme.shapes.spacing.main}
				direction={"row"}
			>
				<CTextFieldOutlined
					value={value.major}
					required={required}
					onChange={(e) => updateVersion("major", e.target.value)}
					label="major"
					sx={sxMerger(style.inputs, sx ? sx : {})}
					{...other}
				/>
				<CTextFieldOutlined
					value={value.minor}
					required={required}
					onChange={(e) => updateVersion("minor", e.target.value)}
					label="minor"
					sx={sxMerger(style.inputs, sx ? sx : {})}
					{...other}
				/>
				<CTextFieldOutlined
					value={value.patch}
					required={required}
					onChange={(e) => updateVersion("patch", e.target.value)}
					label="patch"
					sx={sxMerger(style.inputs, sx ? sx : {})}
					{...other}
				/>
			</Stack>
		</Stack>
	);
}

export default CVersionFieldOutlined;
