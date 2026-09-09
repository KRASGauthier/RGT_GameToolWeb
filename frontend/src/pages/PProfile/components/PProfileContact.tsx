import type { GCompProps } from "../../../../rgt/components/shared/ccommon";
import { Stack } from "@mui/material";
import CForm from "../../../../rgt/components/inputs/form/CForm";
import type { IFormEntry, TFormDataType } from "../../../../rgt/components/inputs/form/CForm";
import { PProfileStyle } from "../../../style/pages/profiles/PProfileStyle";
import { useState, useEffect } from "react";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import { apiUserGetFullSelf, apiUserPatchSelf } from "../../../../rgt/api/user/userAPI";
import type { IUserFull } from "../../../../rgt/types/data/TUser";

export interface PProfileContactProps extends GCompProps {}

function PProfileContact({}: PProfileContactProps) {

	//====================== DATA ======================
	const style = PProfileStyle();
	const [user, setUser] = useState<IUserFull | undefined>(undefined);
	
	const { push } = useNotif();

	//====================== EFFECT ======================
	useEffect(() => {
		apiUserGetFullSelf(setUser, push);
	}, [push]);

	const profileContactEntries: IFormEntry[] = [
		{
			type: "email",
			field: "email",
			required: true,
		},
	];

	const handleSendEdit = async (data: TFormDataType): Promise<boolean> => {
		if (!user) return false;
		const updatedUser = await apiUserPatchSelf(data, push);
		if (!updatedUser) return false;
		setUser(updatedUser);
		push({ severity: "success", message: "Email updated." });
		return true;
	};

	if (!user) return null;

	return (
		<Stack sx={style.main}>
			<CForm
				entries={profileContactEntries}
				values={{
					email: user.email,
				}}
				onSendEdit={handleSendEdit}
				managedButtonPosition="flex-end"
			/>
		</Stack>
	);
}

export default PProfileContact;