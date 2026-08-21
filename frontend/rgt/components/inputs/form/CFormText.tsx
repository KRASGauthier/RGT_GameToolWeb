import { Stack } from "@mui/material";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import type { CFormCompProps } from "./CForm";
import CText from "../../text/CText";
import { appTheme } from "../../../../src/style/theme";
import { useCallback, useMemo, useState } from "react";
import { keyboartdIsSubmit } from "../../../utils/UKeyboard";

export interface CFormTextProps extends CFormCompProps {}

function CFormText({ entry, style, outlinedStyling, onChange, onEnter }: CFormTextProps) {
	const [value, setValue] = useState<string>("");

	const check = useCallback(
		(checkedValue: string): string => {
			const trimed = checkedValue.trim();
			if (!trimed) return "";
			if (entry.filter && !trimed.match(entry.filter))
				return "Unallowed charcter is begin used";
			if (entry.min && trimed.length < entry.min)
				return (
					"Too few characters (min: " + entry.max + ", current: " + trimed.length + ")"
				);
			if (entry.max && trimed.length > entry.max)
				return (
					"Too many characters (max: " + entry.max + ", current: " + trimed.length + ")"
				);
			return "";
		},
		[entry],
	);
	const error = useMemo((): string => {
		return check(value);
	}, [value, check]);

	return (
		<Stack direction={"column"}>
			<CTextFieldOutlined
				value={value}
				onChange={(e) => {
					setValue(e.target.value);

					onChange(
						!check(e.target.value) ? e.target.value : false,
						entry.field ?? "value",
					);
				}}
				onKeyUp={(event) => {
					if (keyboartdIsSubmit(event)) onEnter();
				}}
				styling={outlinedStyling ?? "neutral"}
				sx={style.shared}
				type="text"
				label={entry.label ?? "Value"}
				error={error ? true : false}
			/>
			{error && (
				<CText size="xs" weight={5} sx={{ color: appTheme.colors.error[6], ml: "10px" }}>
					{error}
				</CText>
			)}
		</Stack>
	);
}

export default CFormText;
