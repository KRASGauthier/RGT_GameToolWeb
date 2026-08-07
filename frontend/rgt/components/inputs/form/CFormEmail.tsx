import { Stack } from "@mui/material";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import { getFormTypeDefaultField, type CFormCompProps } from "./CForm";
import { useCallback, useMemo, useState } from "react";
import CText from "../../text/CText";
import { appTheme } from "../../../../src/style/theme";

export interface CFormEmailProps extends CFormCompProps {}

function CFormEmail({ entry, style, outlinedStyling, onChange }: CFormEmailProps) {
	const [value, setValue] = useState<string>("");

	const check = useCallback(
		(checkedValue: string) => {
			const trimed = checkedValue.trim();
			if (!trimed.trim()) return "";
			if (!trimed.match(entry.filter ? entry.filter : /^[^\s@]+@[^\s@]+\.[^\s@]+$/))
				return "Invalid eMail format";
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
	}, [check, value]);

	return (
		<Stack direction={"column"}>
			<CTextFieldOutlined
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(
						!check(e.target.value) ? e.target.value : false,
						entry.field ?? getFormTypeDefaultField(entry.type),
					);
				}}
				styling={outlinedStyling ?? "neutral"}
				sx={style.shared}
				type="email"
				label={entry.label ?? "eMail"}
			/>
			{error && (
				<CText size="xs" weight={5} sx={{ color: appTheme.colors.error[6], ml: "10px" }}>
					{error}
				</CText>
			)}
		</Stack>
	);
}

export default CFormEmail;
