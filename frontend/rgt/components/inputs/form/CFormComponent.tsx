import { InputAdornment, Stack } from "@mui/material";
import type { IFormStyle } from "../../../style/components/inputs/CFormStyle";
import type { CInputOutlinedStyling } from "../../../style/components/inputs/sharedStyle";
import type { IVersion } from "../../../types/TShared";
import type { GCompProps } from "../../shared/ccommon";
import { getFormTypeDefaultField, type IFormEntry, type TFormDataType } from "./CForm";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import { keyboartdIsSubmit } from "../../../utils/UKeyboard";
import CText from "../../text/CText";
import { appTheme } from "../../../../src/style/theme";
import { useDebounced } from "../../../hooks/useDebounced";
import CButtonIcon from "../buttons/CButtonIcon";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type TFormAvailability = "not-available" | "checking" | "available";
export type TFormComponentFilter = {
	filter: RegExp;
	message: string;
};
export interface CFormComponentProps extends GCompProps {
	//Sub component only
	type: React.HTMLInputTypeAttribute;
	localFilter?: TFormComponentFilter;
	subMessages?: ReactNode;
	addEye?: boolean;
	subValueChanged?: (value: string | IVersion) => void;
	customCheck?: (trimedValue: string, soft?: boolean) => string;

	//CForm
	entry: IFormEntry;
	exists?: string;
	values?: TFormDataType;

	style: IFormStyle;
	outlinedStyling?: CInputOutlinedStyling;

	onChange: (value: string | boolean | IVersion, field: string) => void;
	onEnter: () => void;
	checkAvailable?: (username: string) => Promise<boolean>;
}
export interface CFormSubComponentProps extends Omit<
	CFormComponentProps,
	"type" | "localFilter" | "customCheck" | "subMessages" | "subValueChanged" | "addEye"
> {}

function CFormComponent({
	type,
	localFilter,
	subMessages,
	addEye,
	subValueChanged,
	customCheck,
	entry,
	values,
	exists,
	style,
	outlinedStyling,
	onChange,
	onEnter,
	checkAvailable,
}: CFormComponentProps) {
	const getValue = (): string | undefined => {
		if (!values) return undefined;
		const value = values[entry.field ?? getFormTypeDefaultField(entry.type)];
		if (typeof value == "boolean" || typeof value == "object") return undefined;
		return value;
	};

	//====================== DATA ======================
	const [localValue, setLocalValue] = useState<string>("");
	const value: string = getValue() ?? localValue;
	const [localExists, setLocalExists] = useState<string | undefined>(undefined);
	const [checking, setChecking] = useState<TFormAvailability>("not-available");
	const [show, setShow] = useState<boolean>(false);

	//====================== ERROR ======================
	const check = useCallback(
		(checkedValue: string, soft?: boolean): string => {
			if (entry.login) return "";
			const trimed = checkedValue.trim();
			if (!trimed) return "";
			if (entry.filter && !trimed.match(entry.filter))
				return "Unallowed charcter is begin used";
			if (localFilter && !trimed.match(localFilter.filter)) return localFilter.message;
			if (entry.min && trimed.length < entry.min)
				return (
					"Too few characters (min: " + entry.min + ", current: " + trimed.length + ")"
				);
			if (entry.max && trimed.length > entry.max)
				return (
					"Too many characters (max: " + entry.max + ", current: " + trimed.length + ")"
				);
			if (exists === checkedValue || localExists == checkedValue)
				return `This ${entry.label ?? entry.field ?? getFormTypeDefaultField(entry.type)} is already taken`;

			if (customCheck) return customCheck(trimed, soft);

			return "";
		},
		[entry, exists, localFilter, customCheck, localExists],
	);
	const error = useMemo((): string => {
		return check(value, true);
	}, [value, check]);

	//====================== EXIST ======================
	const prevExist: React.RefObject<string | undefined> = useRef<string | undefined>(exists);
	const { call: checkUsername } = useDebounced((value: string) => {
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
		setLocalValue(value);
		setChecking("checking");
		checkUsername(value);
	};
	useEffect(() => {
		if (prevExist.current == exists) return;

		prevExist.current = exists;
		onChange(!check(value) ? value : false, entry.field ?? getFormTypeDefaultField(entry.type));
	}, [exists, entry, prevExist, value, onChange, check]);

	//====================== NODE ======================
	return (
		<Stack direction={"column"}>
			<CTextFieldOutlined
				value={value}
				onChange={(e) => {
					subValueChanged?.(e.target.value);
					if (checkAvailable) return handleChange(e.target.value);
					setLocalValue(e.target.value);

					onChange(
						!check(e.target.value) ? e.target.value : false,
						entry.field ?? getFormTypeDefaultField(entry.type),
					);
				}}
				onKeyUp={(event) => {
					if (keyboartdIsSubmit(event)) onEnter();
				}}
				styling={checking == "available" ? "valid" : (outlinedStyling ?? "neutral")}
				sx={style.shared}
				type={show ? "text" : type}
				label={entry.label ?? getFormTypeDefaultField(entry.type, true)}
				error={check(value, false) ? true : false}
				required={entry.required}

				slotProps={
					addEye
						? {
								input: {
									endAdornment: (
										<InputAdornment position="end">
											<CButtonIcon
												padding={4}
												styling="medium"
												onClick={() => setShow(!show)}
												icon={
													show ? (
														<VisibilityOffIcon fontSize="small" />
													) : (
														<VisibilityIcon fontSize="small" />
													)
												}
											/>
										</InputAdornment>
									),
								},
							}
						: undefined
				}
			/>
			{error && !entry.login && (
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
			{subMessages}
		</Stack>
	);
}

export default CFormComponent;
