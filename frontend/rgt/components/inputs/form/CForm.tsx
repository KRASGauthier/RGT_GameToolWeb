import { Stack } from "@mui/material";
import type { GCompProps } from "../../shared/ccommon";
import CFormEmail from "./CFormEmail";
import CFormPassword from "./CFormPassword";
import { useMemo, useState } from "react";
import { CFormStyle, type IFormStyle } from "../../../style/components/inputs/CFormStyle";
import { appTheme } from "../../../../src/style/theme";
import CButtonText from "../buttons/CButtonText";
import type { CInputOutlinedStyling } from "../../../style/components/inputs/sharedStyle";
import type { TButtonStylingTypes } from "../buttons/CButton";
import type { TSize } from "../../../types/TStyles";
import CFormPasswordConfirm from "./CFormPasswordConfirm";
import CFormText from "./CFormText";
import CFormUser from "./CFormUser";

export type TFormTypes = "text" | "user" | "email" | "password" | "password-confirm";
export function getFormTypeDefaultField(type: TFormTypes): string {
	switch (type) {
		case "text":
			return "value";
		case "email":
			return "email";
		case "password":
			return "password";
		case "user":
			return "username";
	}
	return "value";
}
export interface IFormEntry {
	type: TFormTypes;

	label?: string;
	filter?: RegExp;
	field?: string;
	required?: boolean;

	min?: number;
	max?: number;
	multiLang?: boolean;
}

export interface CFormCompProps extends GCompProps {
	entry: IFormEntry;
	style: IFormStyle;

	outlinedStyling?: CInputOutlinedStyling;

	onChange: (value: string | boolean, field: string) => void;
}

export interface CFormProps extends GCompProps {
	entries: IFormEntry[];
	buttonMessage?: string;

	outlinedStyling?: CInputOutlinedStyling;
	buttonStyling?: TButtonStylingTypes;

	minWidth?: TSize;
}

function CForm({ entries, buttonMessage, outlinedStyling, buttonStyling, minWidth }: CFormProps) {
	const style: IFormStyle = useMemo(() => {
		return CFormStyle({ minWidth });
	}, [minWidth]);

	const [valueObject, setValueObject] = useState<Record<string, string | boolean>>({});

	const onChange = (value: string | boolean, field: string) => {
		const copy: Record<string, string | boolean> = structuredClone(valueObject);
		copy[field] = value;
		setValueObject(copy);
	};
	const onMatch = (matched: boolean) => {
		const copy: Record<string, string | boolean> = structuredClone(valueObject);
		copy.match = matched;
		setValueObject(copy);
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
		if (!valueObject.match) return false;
		return true;
	};

	return (
		<Stack spacing={appTheme.shapes.spacing.medium} sx={style.main}>
			{entries.map((entry: IFormEntry) => {
				switch (entry.type) {
					case "text":
						return (
							<CFormText
								onChange={onChange}
								entry={entry}
								style={style}
								outlinedStyling={outlinedStyling}
							/>
						);
					case "user":
						return (
							<CFormUser
								onChange={onChange}
								entry={entry}
								style={style}
								outlinedStyling={outlinedStyling}
							/>
						);
					case "email":
						return (
							<CFormEmail
								onChange={onChange}
								entry={entry}
								style={style}
								outlinedStyling={outlinedStyling}
							/>
						);
					case "password":
						return (
							<CFormPassword
								onChange={onChange}
								entry={entry}
								style={style}
								outlinedStyling={outlinedStyling}
							/>
						);
					case "password-confirm":
						return (
							<CFormPasswordConfirm
								valueObject={valueObject}
								onChange={onChange}
								entry={entry}
								style={style}
								outlinedStyling={outlinedStyling}
								onMatch={onMatch}
							/>
						);
				}
				return null;
			})}
			<CButtonText disabled={!isValid()} styling={buttonStyling ?? "light"}>
				{buttonMessage ?? "Validate"}
			</CButtonText>
		</Stack>
	);
}

export default CForm;
