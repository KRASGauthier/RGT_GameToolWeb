import { InputAdornment, Stack } from "@mui/material";
import CTextFieldOutlined from "../text/CTextFieldOutlined";
import type { CFormCompProps } from "./CForm";
import { useCallback, useMemo, useState } from "react";
import CText from "../../text/CText";
import { appTheme } from "../../../../src/style/theme";
import { PASSWORD_MAX, PASSWORD_MIN } from "../../../../rgt/consts";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CButtonIcon from "../buttons/CButtonIcon";
import { keyboartdIsSubmit } from "../../../utils/UKeyboard";

export interface CFormPasswordProps extends CFormCompProps {}

function CFormPassword({ entry, style, outlinedStyling, onChange, onEnter }: CFormPasswordProps) {
	const [value, setValue] = useState<string>("");
	const [show, setShow] = useState<boolean>(false);

	const check = useCallback(
		(checkedValue: string, soft?: boolean) => {
			if (entry.login) return "";
			const trimed = checkedValue.trim();
			if (!trimed) return "";
			if (!trimed.match(entry.filter ?? /^[\x21-\x7E]+$/))
				return "Unallowed charcter is begin used";
			if (soft) return "";
			if (trimed.length < PASSWORD_MIN || trimed.length > PASSWORD_MAX)
				return "Must contain between 8 and 20 characters";
			if (!trimed.match(/[A-Z]/)) return "Must contain at least: 1 uppercase";
			if (!trimed.match(/[0-9]/)) return "Must contain at least: 1 number";
			if (!trimed.match(/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/))
				return "Must contain at least: 1 special character";
			return "";
		},
		[entry],
	);

	const error = useMemo((): string => {
		return check(value, true);
	}, [check, value]);

	return (
		<Stack direction={"column"}>
			<CTextFieldOutlined
				value={value}
				onChange={(e) => {
					setValue(e.target.value);

					onChange(
						!check(e.target.value) ? e.target.value : false,
						entry.field ?? "password",
					);
				}}
				onKeyUp={(event) => {
					if (keyboartdIsSubmit(event)) onEnter();
				}}
				styling={outlinedStyling ?? "neutral"}
				sx={style.shared}
				type={show ? "text" : "password"}
				label={entry.label ?? "Password"}
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
				error={check(value, false) ? true : false}
			/>
			{error && !entry.login && (
				<CText size="xs" weight={5} sx={{ color: appTheme.colors.error[6], ml: "10px" }}>
					{error}
				</CText>
			)}
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
		</Stack>
	);
}

export default CFormPassword;
