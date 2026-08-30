import { useState } from "react";
import type { IFormEntry, TFromDataType } from "./CForm";
import type { CFormComponentProps } from "./CFormComponent";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import { InputAdornment, Stack } from "@mui/material";
import { keyboartdIsSubmit } from "../../../utils/UKeyboard";
import CButtonIcon from "../buttons/CButtonIcon";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { appTheme } from "../../../../src/style/theme";
import CText from "../../text/CText";

export interface CFormComponentConfirmProps extends CFormComponentProps {
	
	//FROM SUB COMP
	defaultTarget: string;
	defaultLabel?: string;
	errorMessage: string;
	
	//CFORM
	valueObject: TFromDataType;
	entry: IFormEntry;

	onMatch: (value: boolean) => void;
}

function CFormComponentConfirm({
	defaultTarget,
	defaultLabel,
	errorMessage,
	type,
	addEye,
	entry,
	valueObject,
	style,
	outlinedStyling,
	onMatch,
	onEnter,
 	}: CFormComponentConfirmProps) {
 	const [value, setValue] = useState<string>("");
	const [show, setShow] = useState<boolean>(false);

	const getTarget = (): string => {
		return entry.checkTarget ?? defaultTarget;
	}

	return (
		<Stack direction={"column"}>
			<CTextFieldOutlined
				onChange={(e) => {
					setValue(e.target.value);
					onMatch(
						!(
							!valueObject[getTarget()] ||
							!e.target.value ||
							e.target.value !== valueObject[getTarget()]
						),
					);
				}}
				onKeyUp={(event) => {
					if (keyboartdIsSubmit(event)) onEnter();
				}}
				styling={outlinedStyling ?? "neutral"}
				sx={style.shared}
				type={show ? "text" : type}
				label={entry.label ?? defaultLabel ?? "Confirm"}
				slotProps={addEye ? {
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
				} : undefined}
				error={
					valueObject[getTarget()] && value && value !== valueObject[getTarget()] ? true : false
				}
				required={entry.required}
			/>
			{valueObject[getTarget()] && value && value !== valueObject[getTarget()] && (
				<CText size="xs" weight={5} sx={{ color: appTheme.colors.error[6], ml: "10px" }}>
					{errorMessage}
				</CText>
			)}
		</Stack>
	);
}

export default CFormComponentConfirm;