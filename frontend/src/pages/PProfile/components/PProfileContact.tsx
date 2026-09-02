import type { GCompProps } from "../../../../rgt/components/shared/ccommon";
import { Stack } from "@mui/material";
import CTextFieldOutlined from "../../../../rgt/components/inputs/text/CTextFieldOutlined";
import CButtonText from "../../../../rgt/components/inputs/buttons/CButtonText";
import { PProfileStyle } from "../../../style/pages/profiles/PProfileStyle";
import { useState, useEffect } from "react";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import { apiUserGetFullSelf, apiUserPatchSelf } from "../../../../rgt/api/user/userAPI";
import type { IUserFull } from "../../../../rgt/types/data/TUser";

export interface PProfileInformationProps extends GCompProps {}

function PProfileContact({}: PProfileInformationProps) {

	//====================== DATA ======================
	const style = PProfileStyle();
	const [user, setUser] = useState<IUserFull | undefined>(undefined);
	const [changes, setChanges] = useState<Partial<Pick<IUserFull, "email">>>({});
	const hasChanges = Object.keys(changes).length > 0;
	
	const { push } = useNotif();
	
	//====================== EVENT ======================
	useEffect(() => {
		apiUserGetFullSelf(setUser, push);
	}, [push]);

	const handleChange = <key extends keyof Pick<IUserFull, "email">>(
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
		push({ severity: "success", message: "Email updated." });
	};

	return (
		<Stack sx={style.main}>
			<CTextFieldOutlined
				label="Email"
				value={changes.email ?? user?.email ?? ""}
				onChange={(el) => handleChange("email", el.target.value)}
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
export default PProfileContact;
