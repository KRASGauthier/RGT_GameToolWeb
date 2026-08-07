import { Stack } from "@mui/material";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import type { CFormCompProps } from "./CForm";
import { useCallback, useMemo, useState } from "react";
import { appTheme } from "../../../../src/style/theme";
import CText from "../../text/CText";

export interface CFormUserProps extends CFormCompProps {}

function CFormUser({ entry, style, outlinedStyling, onChange }: CFormUserProps) {
	const [value, setValue] = useState<string>("");

	const check = useCallback(
		(checkedValue: string): string => {
			const trimed = checkedValue.trim();
			if (!trimed.trim()) return "";
			if (
				!trimed.match(
					entry.filter
						? entry.filter
						: entry.multiLang
							? /^[\p{L}\p{M}\p{N}_]+$/u
							: /^[A-Za-z0-9_]+$/,
				)
			)
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
						entry.field ?? "username",
					);
				}}
				styling={outlinedStyling ?? "neutral"}
				sx={style.shared}
				type="text"
				label={entry.label ?? "Username"}
			/>
			{error && (
				<CText size="xs" weight={5} sx={{ color: appTheme.colors.error[6], ml: "10px" }}>
					{error}
				</CText>
			)}
		</Stack>
	);
}

export default CFormUser;
