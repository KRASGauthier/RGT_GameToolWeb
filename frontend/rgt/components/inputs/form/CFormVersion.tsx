import { Stack } from "@mui/material";
import { getFormTypeDefaultField } from "./CForm";
import { useState } from "react";
import { keyboartdIsSubmit } from "../../../utils/UKeyboard";
import CVersionFieldOutlined from "../text/CVersionFieldOutlined";
import type { IVersion } from "../../../types/TShared";
import type { CFormSubComponentProps } from "./CFormComponent";

export interface CFormVersionProps extends CFormSubComponentProps {}

function CFormVersion({
	entry,
	values,
	style,
	outlinedStyling,
	onChange,
	onEnter,
}: CFormVersionProps) {
	const getValue = (): IVersion | undefined => {
		if (!values) return undefined;
		const value = values[entry.field ?? getFormTypeDefaultField(entry.type)];
		if (typeof value == "boolean" || typeof value != "object") return undefined;
		return value;
	};

	//====================== DATA ======================
	const [localValue, setLocalValue] = useState<IVersion>({ major: 1, minor: 0, patch: 0 });
	const value: IVersion = getValue() ?? localValue;

	return (
		<Stack direction={"column"}>
			<CVersionFieldOutlined
				value={value}
				onChange={(version: IVersion) => {
					setLocalValue(version);
					onChange(version, entry.field ?? getFormTypeDefaultField(entry.type));
				}}
				onKeyUp={(event) => {
					if (keyboartdIsSubmit(event)) onEnter();
				}}
				styling={outlinedStyling ?? "neutral"}
				sx={style.shared}
				label={entry.label}
				required={entry.required}
				filled
			/>
		</Stack>
	);
}

export default CFormVersion;
