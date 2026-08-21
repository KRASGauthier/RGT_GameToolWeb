import { InputAdornment, Stack } from "@mui/material";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import type { CFormCompProps } from "./CForm";
import { useState } from "react";
import CText from "../../text/CText";
import { appTheme } from "../../../../src/style/theme";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CButtonIcon from "../buttons/CButtonIcon";
import { keyboartdIsSubmit } from "../../../utils/UKeyboard";

export interface CFormPasswordConfirmProps extends CFormCompProps {
	valueObject: Record<string, string | boolean>;

	onMatch: (value: boolean) => void;
}

function CFormPasswordConfirm({
	entry,
	valueObject,
	style,
	outlinedStyling,
	onMatch,
	onEnter,
}: CFormPasswordConfirmProps) {
	const [value, setValue] = useState<string>("");
	const [show, setShow] = useState<boolean>(false);

	return (
		<Stack direction={"column"}>
			<CTextFieldOutlined
				onChange={(e) => {
					setValue(e.target.value);
					onMatch(
						!(
							!valueObject.password ||
							!e.target.value ||
							e.target.value !== valueObject.password
						),
					);
				}}
				onKeyUp={(event) => {
					if (keyboartdIsSubmit(event)) onEnter();
				}}
				styling={outlinedStyling ?? "neutral"}
				sx={style.shared}
				type={show ? "text" : "password"}
				label={entry.label ?? "Confirm password"}
				slotProps={{
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
				}}
				error={
					valueObject.password && value && value !== valueObject.password ? true : false
				}
			/>
			{valueObject.password && value && value !== valueObject.password && (
				<CText size="xs" weight={5} sx={{ color: appTheme.colors.error[6], ml: "10px" }}>
					{"Password is not matching"}
				</CText>
			)}
		</Stack>
	);
}

export default CFormPasswordConfirm;
