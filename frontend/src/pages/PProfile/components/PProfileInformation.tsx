import type { GCompProps } from "../../../../rgt/components/shared/ccommon";
import { Stack } from "@mui/material";
import CTextFieldOutlined from "../../../../rgt/components/inputs/text/CTextFieldOutlined";
import CButtonText from "../../../../rgt/components/inputs/buttons/CButtonText";
import { useState, useEffect } from "react";
import { apiUserGetFullSelf, apiUserPatchSelf } from "../../../../rgt/api/user/userAPI";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import type { IUserFull } from "../../../../rgt/types/data/TUser";
import { PProfileStyle } from "../../../style/pages/profiles/PProfileStyle";

export interface PProfileInformationProps extends GCompProps {}

function PProfileInformation({}: PProfileInformationProps) {
	const style = PProfileStyle();
	const { push } = useNotif();
	const [user, setUser] = useState<IUserFull | undefined>(undefined);
	const [changes, setChanges] = useState<Partial<Pick<IUserFull, "firstName" | "lastName" | "username">>>({});
	const hasChanges = Object.keys(changes).length > 0;

	useEffect(() => {
		apiUserGetFullSelf(setUser, push);
	}, [push]);

	const handleChange = <key extends keyof Pick<IUserFull, "firstName" | "lastName" | "username">>(
		field: key,
		value: string,
	) => {
		if (!user) return;
		setChanges((prev) => {
			const next = { ...prev };
			const savedValue = user[field] ?? "";
			if (value === savedValue) delete next[field];
			else next[field] = value as never;
			return next;
		});
	};

	const handleCancel = () => {
		setChanges({});
	};

	const handleSave = async () => {
		if (!user || !hasChanges) return;
		const updatedUser = await apiUserPatchSelf(changes, push);
		if (!updatedUser) return;
		setUser(updatedUser);
		setChanges({});
		push({ severity: "success", message: "Profile updated." });
	};

	if (!user) return null;

	return (
		<Stack sx={style.main}>
			<CTextFieldOutlined
				label="First Name"
				value={changes.firstName ?? user?.firstName ?? ""}
				onChange={(el) => handleChange("firstName", el.target.value)}
				sx={style.input}
				styling="neutral"
				fullWidth
			/>

			<CTextFieldOutlined
				label="Last Name"
				value={changes.lastName ?? user?.lastName ?? ""}
				onChange={(el) => handleChange("lastName", el.target.value)}
				sx={style.input}
				styling="neutral"
				fullWidth
			/>

			<CTextFieldOutlined
				label="Username"
				value={changes.username ?? user?.username ?? ""}
				onChange={(el) => handleChange("username", el.target.value)}
				sx={style.input}
				styling="neutral"
				fullWidth
			/>

			{hasChanges && (
				<Stack direction="row" sx={style.buttons}>
					<CButtonText onClick={handleCancel} styling="cancel">
						Cancel
					</CButtonText>
					<CButtonText onClick={handleSave}>Save</CButtonText>
				</Stack>
			)}
		</Stack>
	);
}

export default PProfileInformation;
