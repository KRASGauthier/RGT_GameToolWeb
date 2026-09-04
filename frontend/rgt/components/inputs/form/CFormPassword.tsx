import { useCallback, useMemo, useState } from "react";
import { PASSWORD_MAX, PASSWORD_MIN } from "../../../consts";
import type { CFormSubComponentProps } from "./CFormComponent";
import CFormComponent from "./CFormComponent";
import CText from "../../text/CText";
import { appTheme } from "../../../../src/style/theme";
import type { IVersion } from "../../../types/TShared";

export interface CFormPasswordProps extends CFormSubComponentProps {}

function CFormPassword({ entry, ...other }: CFormPasswordProps) {
	const [value, setValue] = useState<string>("");
	const setValueValid = (value: string | IVersion) => {
		if (typeof value == "object") return;
		setValue(value);
	};

	const check = useCallback((trimed: string, soft?: boolean) => {
		if (!trimed.match(/^[\x21-\x7E]+$/)) return "Unallowed charcter is begin used";
		if (soft) return "";
		if (trimed.length < PASSWORD_MIN || trimed.length > PASSWORD_MAX)
			return "Must contain between 8 and 20 characters";
		if (!trimed.match(/[A-Z]/)) return "Must contain at least: 1 uppercase";
		if (!trimed.match(/[0-9]/)) return "Must contain at least: 1 number";
		if (!trimed.match(/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/))
			return "Must contain at least: 1 special character";
		return "";
	}, []);
	const subMessages = useMemo(() => {
		return (
			<>
				{value && !entry.login && (
					<CText
						size="xs"
						weight={5}
						sx={{
							color: appTheme.colors[
								value.length < PASSWORD_MIN || value.length > PASSWORD_MAX
									? "error"
									: "valid"
							][6],
							ml: "10px",
						}}
					>
						Must contain between 8 and 20 characters
					</CText>
				)}
				{value && !entry.login && (
					<CText
						size="xs"
						weight={5}
						sx={{
							color: appTheme.colors[!value.match(/[A-Z]/) ? "error" : "valid"][6],
							ml: "10px",
						}}
					>
						Must contain at least: 1 uppercase
					</CText>
				)}
				{value && !entry.login && (
					<CText
						size="xs"
						weight={5}
						sx={{
							color: appTheme.colors[!value.match(/[0-9]/) ? "error" : "valid"][6],
							ml: "10px",
						}}
					>
						Must contain at least: 1 number
					</CText>
				)}
				{value && !entry.login && (
					<CText
						size="xs"
						weight={5}
						sx={{
							color: appTheme.colors[
								!value.match(/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/)
									? "error"
									: "valid"
							][6],
							ml: "10px",
						}}
					>
						Must contain at least: 1 special character
					</CText>
				)}
			</>
		);
	}, [entry, value]);

	return (
		<CFormComponent
			type="password"
			subMessages={subMessages}
			addEye
			subValueChanged={setValueValid}
			customCheck={check}
			entry={entry}
			{...other}
		/>
	);
}

export default CFormPassword;
