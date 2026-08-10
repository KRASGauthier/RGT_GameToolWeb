import { Stack } from "@mui/material";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import { getFormTypeDefaultField, type CFormCompProps } from "./CForm";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { appTheme } from "../../../../src/style/theme";
import CText from "../../text/CText";
import { useDebounced } from "../../../hooks/useDebounced";

export interface CFormUserProps extends CFormCompProps {
	checkAvailable?: (username: string) => Promise<boolean>;
}

type TUserNameAvailability = "not-available" | "checking" | "available";
function CFormUser({
	entry,
	exists,
	style,
	outlinedStyling,
	onChange,
	checkAvailable,
}: CFormUserProps) {
	const [value, setValue] = useState<string>("");
	const [localExists, setLocalExists] = useState<string | undefined>(undefined);
	const [checking, setChecking] = useState<TUserNameAvailability>("not-available");

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
			if (exists === checkedValue)
				return `This is ${entry.field ?? "username"} is already taken`;
			if (localExists === checkedValue)
				return `This is ${entry.field ?? "username"} is already taken`;
			return "";
		},
		[entry, exists, localExists],
	);
	const error = useMemo((): string => {
		return check(value);
	}, [value, check]);

	//====================== DEBOUNCED ======================
	const { call } = useDebounced((value: string) => {
		if (check(value) || !value.trim()) {
			onChange(false, entry.field ?? getFormTypeDefaultField(entry.type));
			setChecking("not-available");
			return;
		}
		if (!checkAvailable) {
			onChange(value, entry.field ?? getFormTypeDefaultField(entry.type));
			setChecking("not-available");
			return;
		}
		checkAvailable(value)
			.then((result: boolean) => {
				if (!result) setLocalExists(value);
				setChecking(result ? "available" : "not-available");
				onChange(
					!result ? false : !check(value) ? value : false,
					entry.field ?? getFormTypeDefaultField(entry.type),
				);
			})
			.catch(() => {
				onChange(
					!check(value) ? value : false,
					entry.field ?? getFormTypeDefaultField(entry.type),
				);
				setChecking("not-available");
			});
	}, 1000);
	const handleChange = (value: string) => {
		onChange(false, entry.field ?? getFormTypeDefaultField(entry.type));
		setValue(value);
		setChecking("checking");
		call(value);
	};

	const prevExist: React.RefObject<string | undefined> = useRef<string | undefined>(exists);
	useEffect(() => {
		if (prevExist.current == exists) return;

		prevExist.current = exists;
		onChange(!check(value) ? value : false, entry.field ?? getFormTypeDefaultField(entry.type));
	}, [exists, entry, prevExist, value, onChange, check]);

	return (
		<Stack direction={"column"}>
			<CTextFieldOutlined
				value={value}
				onChange={(e) => {
					handleChange(e.target.value);
				}}
				styling={checking == "available" ? "valid" : (outlinedStyling ?? "neutral")}
				sx={style.shared}
				type="text"
				label={entry.label ?? "Username"}
				error={error ? true : false}
			/>
			{error && (
				<CText size="xs" weight={5} sx={{ color: appTheme.colors.error[6], ml: "10px" }}>
					{error}
				</CText>
			)}
			{checking == "checking" && (
				<CText size="xs" weight={5} sx={{ color: appTheme.colors.primary[8], ml: "10px" }}>
					Checking availability...
				</CText>
			)}
			{checking == "available" && (
				<CText size="xs" weight={5} sx={{ color: appTheme.colors.valid[65], ml: "10px" }}>
					{`This ${entry.field ?? getFormTypeDefaultField(entry.type)} is available`}
				</CText>
			)}
		</Stack>
	);
}

export default CFormUser;
