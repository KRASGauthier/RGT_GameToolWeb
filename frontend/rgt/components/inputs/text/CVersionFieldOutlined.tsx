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

export interface CVersionFieldOutlinedProps extends GCompProps, Omit<CTextFieldOutlinedProps, "label" | "onChange" | "required"> {

	value: IVersion;
	required?: boolean;

	label?: string;
	filled?: boolean;

	onChange?: (version: IVersion) => void
}

function CVersionFieldOutlined({value, required, label, filled, onChange, ...other }: CVersionFieldOutlinedProps) {
	const style: IVersionFieldOutlinedStyle = useMemo(() => {
		return CVersionFieldOutlinedStyle({filled});
	}, [filled]);

	const updateVersion = (target: TVersionType, nValue: string) => {
		nValue.replaceAll(/[^0-9]/g, "")
		
		onChange?.({
			...value,
			[target]: !nValue ? 0 : parseInt(nValue),
		})
	}

	return (
		<Stack direction={"column"}>
			{label && <CText weight={5} size="md">{label}</CText>}
			<Stack sx={{mt: label ? "7px" : 0}} spacing={appTheme.shapes.spacing.main} direction={"row"}>
				<CTextFieldOutlined value={value.major} required={required} onChange={(e) => updateVersion("major", e.target.value)} label="major" sx={style.inputs} {...other}/>
				<CTextFieldOutlined value={value.minor} required={required} onChange={(e) => updateVersion("minor", e.target.value)} label="minor" sx={style.inputs} {...other}/>
				<CTextFieldOutlined value={value.patch} required={required} onChange={(e) => updateVersion("patch", e.target.value)} label="patch" sx={style.inputs} {...other}/>
			</Stack>
		</Stack>
	);
}

export default CVersionFieldOutlined;
