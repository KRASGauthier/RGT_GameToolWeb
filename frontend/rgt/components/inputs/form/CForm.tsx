import { Stack, type SxProps, type Theme } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import CFormEmail from "./CFormEmail";
import CFormPassword from "./CFormPassword";
import { cloneElement, isValidElement, useMemo, useState, type ReactNode } from "react";
import { CFormStyle, type IFormStyle } from "../../../style/components/inputs/CFormStyle";
import { appTheme } from "../../../../src/style/theme";
import CButtonText from "../buttons/CButtonText";
import type { CInputOutlinedStyling } from "../../../style/components/inputs/sharedStyle";
import type { TButtonStylingTypes } from "../buttons/CButton";
import type { TSize } from "../../../types/TStyles";
import CFormPasswordConfirm from "./CFormPasswordConfirm";
import CFormText from "./CFormText";
import CFormUser from "./CFormUser";
import type { TErrorInfo } from "../../../types/api/TAPI";
import type { IVersion } from "../../../types/TShared";
import CFormVersion from "./CFormVersion";

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
export type TFromDataType = Record<string, string | boolean | IVersion>;

//--------------------------------------------------
//                   COMPONENT
//--------------------------------------------------


export interface CFormProps extends GCompProps {
	entries: IFormEntry[];
	defaultValues?: TFromDataType;
	buttonMessage?: string;
	globalError?: ReactNode;
	fieldExists?: TErrorInfo;
	disable?: boolean;

	outlinedStyling?: CInputOutlinedStyling;
	buttonStyling?: TButtonStylingTypes;

	minWidth?: TSize;

	onSend?: (data: TFromDataType) => void;
	onSendEdit?: (data: TFromDataType) => Promise<boolean>;
	onUsernameCheck?: (username: string) => Promise<boolean>;
}

function CForm({
	entries,
	defaultValues,
	buttonMessage,
	globalError,
	fieldExists,
	disable,

	outlinedStyling,
	buttonStyling,

	minWidth,

	onSend,
	onUsernameCheck,
}: CFormProps) {
	//====================== DATA ======================
	const style: IFormStyle = useMemo(() => {
		return CFormStyle({ minWidth });
	}, [minWidth]);

	const [valueObject, setValueObject] = useState<TFromDataType>({});
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
		const copy: TFromDataType = structuredClone(valueObject);
		copy[field] = value;
		setValueObject(copy);
	};
	const handleOnMatch = (matched: boolean) => {
		const copy: TFromDataType = structuredClone(valueObject);
		copy.match = matched;
		setValueObject(copy);
	};
	const handleOnSend = async () => {
		onSend?.(valueObject);
	};
	const isValid = (): boolean => {
		for (let i = 0; i < entries.length; i++) {
			if (!entries[i].required) continue;
			if (entries[i].field) {
				if (!valueObject[entries[i].field!]) return false;
			} else {
				if (!valueObject[getFormTypeDefaultField(entries[i].type)]) return false;
			}
		}
		if (
			entries.find((entry: IFormEntry) => entry.type == "password-confirm") &&
			!valueObject.match
		)
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
								defaultValue={defaultValues}
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
								defaultValue={defaultValues}
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
								defaultValue={defaultValues}
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
								defaultValue={defaultValues}
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
								defaultValue={defaultValues}
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
			<CButtonText
				onClick={handleOnSend}
				disabled={disable || !isValid()}
				styling={buttonStyling ?? "light"}
			>
				{buttonMessage ?? "Validate"}
			</CButtonText>
		</Stack>
	);
}

export default CForm;
