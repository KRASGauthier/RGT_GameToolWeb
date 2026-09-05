import { Stack, type SxProps, type Theme } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import CFormEmail from "./CFormEmail";
import CFormPassword from "./CFormPassword";
import { cloneElement, isValidElement, useMemo, useState, type ReactNode } from "react";
import { CFormStyle, type IFormStyle } from "../../../style/components/inputs/CFormStyle";
import { appTheme } from "../../../../src/style/theme";
import CButtonText from "../buttons/CButtonText";
import type { CInputOutlinedStyling } from "../../../style/components/inputs/sharedStyle";
import type { TSize } from "../../../types/TStyles";
import CFormPasswordConfirm from "./CFormPasswordConfirm";
import CFormText from "./CFormText";
import CFormUser from "./CFormUser";
import type { TErrorInfo } from "../../../types/api/TAPI";
import type { IVersion } from "../../../types/TShared";
import CFormVersion from "./CFormVersion";
import type { TButtonStylingTypes } from "../../../style/components/inputs/CButtonStyle";

//--------------------------------------------------
//                      TYPES
//--------------------------------------------------
export type TFormTypes = "text" | "user" | "email" | "password" | "password-confirm" | "version";
export function getFormTypeDefaultField(type: TFormTypes, display?: boolean): string {
	switch (type) {
		case "text":
			return display ? "Value" : "value";
		case "email":
			return display ? "Email" : "email";
		case "password":
			return display ? "Password" : "password";
		case "user":
			return display ? "Username" : "username";
		case "version":
			return display ? "Version" : "version";
	}
	return "value";
}
export interface IFormEntry {
	type: TFormTypes;

	label?: string;
	filter?: RegExp;
	field?: string;
	required?: boolean;
	login?: boolean;

	min?: number;
	max?: number;
	multiLang?: boolean;

	checkTarget?: string;
}
export type TFormDataType = Record<string, string | boolean | IVersion>;

//--------------------------------------------------
//                   COMPONENT
//--------------------------------------------------

export interface CFormProps extends GCompProps {
	//MAIN
	entries: IFormEntry[]; // Defines the fields rendered by the form
	values?: TFormDataType; // Initial/current values; enables managed edit mode
	buttonMessage?: string; // Overrides the internal submit button label
	globalError?: ReactNode; // Error displayed at form level
	fieldExists?: TErrorInfo; // Backend field-existence validation errors
	disable?: boolean; // Forces form submission to be disabled
	deallocateButton?: boolean; // Prevents CForm from rendering its action buttons

	//STYLING
	outlinedStyling?: CInputOutlinedStyling; // Styling propagated to outlined fields
	buttonStyling?: TButtonStylingTypes; // Styling used by the standard submit button
	managedButtonPosition?: React.CSSProperties["justifyContent"]; // Alignment of managed-mode buttons

	minWidth?: TSize; // Minimum form width

	//FUNCTIONS
	onSend?: (data: TFormDataType) => void; // Called when a standard form is submitted
	onSendEdit?: (data: TFormDataType) => Promise<boolean>; // Called when managed changes are submitted
	onChange?: (data: TFormDataType, valid: boolean) => void; // Reports changed values and form validity
	onUsernameCheck?: (username: string) => Promise<boolean>; // Checks username availability
}

function CForm({
	entries,
	values,
	buttonMessage,
	globalError,
	fieldExists,
	disable,
	deallocateButton,

	outlinedStyling,
	buttonStyling,
	managedButtonPosition,

	minWidth,

	onSend,
	onSendEdit,
	onChange,
	onUsernameCheck,
}: CFormProps) {
	//====================== CHECKER ======================
	const isManaged = (): boolean => {
		return values ? true : false;
	};

	//====================== DATA ======================
	const style: IFormStyle = useMemo(() => {
		return CFormStyle({ minWidth });
	}, [minWidth]);

	const [valueObject, setValueObject] = useState<TFormDataType>(() => {
		const entryFound = entries.find((entry: IFormEntry) => {
			return entry.type == "version";
		});
		if (!entryFound) return {};
		return {
			[entryFound.field ?? getFormTypeDefaultField("version")]: {
				major: 1,
				minor: 0,
				patch: 0,
			},
		};
	});
	const currentValues: TFormDataType | undefined = isManaged()
		? {
				...values,
				...valueObject,
			}
		: undefined;

	let finalGlobalError: ReactNode | undefined = globalError;
	if (finalGlobalError && isValidElement<{ sx?: SxProps<Theme> }>(finalGlobalError)) {
		finalGlobalError = cloneElement(finalGlobalError, {
			sx: {
				...finalGlobalError.props.sx,
				color: appTheme.colors.error[7],
			},
		});
	}

	//====================== EVENT ======================
	const handleOnChange = (value: string | boolean | IVersion, field: string) => {
		const copy: TFormDataType = structuredClone(valueObject);
		copy[field] = value;
		setValueObject(copy);
		onChange?.(copy, isValid(copy));
	};
	const handleOnMatch = (matched: boolean) => {
		const copy: TFormDataType = structuredClone(valueObject);
		copy.match = matched;
		setValueObject(copy);
	};
	const handleOnSend = async () => {
		onSend?.(isManaged() && currentValues ? currentValues : valueObject);
		if (isManaged()) {
			if (await onSendEdit?.(isManaged() && currentValues ? currentValues : valueObject))
				setValueObject({});
		}
	};
	const handleOnCancel = async () => {
		setValueObject({});
	};
	const isValid = (toCheck?: TFormDataType): boolean => {
		const checked: TFormDataType =
			toCheck ?? (isManaged() && currentValues ? currentValues : valueObject);
		for (let i = 0; i < entries.length; i++) {
			if (!entries[i].required) continue;
			if (entries[i].field) {
				if (!checked[entries[i].field!]) return false;
			} else {
				if (!checked[getFormTypeDefaultField(entries[i].type)]) return false;
			}
		}
		if (entries.find((entry: IFormEntry) => entry.type == "password-confirm") && !checked.match)
			return false;
		return true;
	};

	return (
		<Stack spacing={appTheme.shapes.spacing.medium} sx={style.main}>
			{entries.map((entry: IFormEntry, index: number) => {
				switch (entry.type) {
					case "text":
						return (
							<CFormText
								key={entry.type + "-" + index}
								values={currentValues}
								onChange={handleOnChange}
								entry={entry}
								style={style}
								outlinedStyling={outlinedStyling}
								onEnter={handleOnSend}
							/>
						);
					case "user":
						return (
							<CFormUser
								key={entry.type + "-" + index}
								values={currentValues}
								exists={
									(entry.field ?? "username") in (fieldExists ?? {})
										? (fieldExists ?? {})[entry.field ?? "username"]
										: undefined
								}
								onChange={handleOnChange}
								entry={entry}
								style={style}
								outlinedStyling={outlinedStyling}
								checkAvailable={onUsernameCheck}
								onEnter={handleOnSend}
							/>
						);
					case "email":
						return (
							<CFormEmail
								exists={
									(entry.field ?? "email") in (fieldExists ?? {})
										? (fieldExists ?? {})[entry.field ?? "email"]
										: undefined
								}
								key={entry.type + "-" + index}
								values={currentValues}
								onChange={handleOnChange}
								entry={entry}
								style={style}
								outlinedStyling={outlinedStyling}
								onEnter={handleOnSend}
							/>
						);
					case "password":
						return (
							<CFormPassword
								key={entry.type + "-" + index}
								onChange={handleOnChange}
								values={currentValues}
								entry={entry}
								style={style}
								outlinedStyling={outlinedStyling}
								onEnter={handleOnSend}
							/>
						);
					case "password-confirm":
						return (
							<CFormPasswordConfirm
								key={entry.type + "-" + index}
								valueObject={valueObject}
								onChange={handleOnChange}
								entry={entry}
								style={style}
								outlinedStyling={outlinedStyling}
								onMatch={handleOnMatch}
								onEnter={handleOnSend}
							/>
						);
					case "version":
						return (
							<CFormVersion
								key={entry.type + "-" + index}
								values={currentValues}
								onChange={handleOnChange}
								entry={entry}
								style={style}
								outlinedStyling={outlinedStyling}
								onEnter={handleOnSend}
							/>
						);
				}
				return null;
			})}
			{finalGlobalError}
			{!deallocateButton && !isManaged() && (
				<CButtonText
					onClick={handleOnSend}
					disabled={disable || !isValid()}
					styling={buttonStyling ?? "light"}
				>
					{buttonMessage ?? "Validate"}
				</CButtonText>
			)}
			{!deallocateButton && isManaged() && Object.keys(valueObject).length > 0 && (
				<Stack
					spacing={appTheme.shapes.spacing.main}
					sx={{ justifyContent: managedButtonPosition }}
					direction={"row"}
				>
					<CButtonText
						onClick={handleOnSend}
						styling="validate"
						disabled={disable || !isValid()}
					>
						{"Validate"}
					</CButtonText>
					<CButtonText onClick={handleOnCancel} styling="cancel">
						{"Cancel"}
					</CButtonText>
				</Stack>
			)}
		</Stack>
	);
}

export default CForm;
