import type { GCompProps } from "../../../../rgt/components/shared/ccommon";
import { Stack } from "@mui/material";
import CTextFieldOutlined from "../../../../rgt/components/inputs/text/CTextFieldOutlined";
import CButtonText from "../../../../rgt/components/inputs/buttons/CButtonText";
import { useState, useEffect } from "react";
import { apiUserGetFullSelf } from "../../../../rgt/api/user/userAPI";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import type { IUserFull } from "../../../../rgt/types/data/TUser";
import { PProfileStyle } from "../../../style/pages/profiles/PProfileStyle";
import { API_PROFILE } from "../../../consts";
import { apiCheckReponse, apiPatchData } from "../../../../rgt/api/shared";

export interface PProfileInformationProps extends GCompProps {}

function PProfileInformation({}: PProfileInformationProps) {
	const { push } = useNotif();
	const [user, setUser] = useState<IUserFull | undefined>(undefined);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");

	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		apiUserGetFullSelf(setUser, push);
	}, [push]);
	const style = PProfileStyle();

	const handleEdit = () => {
		if (!user) return;
		setFirstName(user.firstName || "");
		setLastName(user.lastName || "");
		setUsername(user.username);
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleSave = async () => {
		if (!user) return;
		const response = await apiPatchData<
			{ firstName: string; lastName: string; username: string },
			{ user: IUserFull }
		>(API_PROFILE, { firstName, lastName, username }, "notif");
		if (!apiCheckReponse(response, "user", { type: "notif", handler: push })) return;
		if (!response.data) return;
		setUser(response.data.user);
		push({ severity: "success", message: "Profile updated." });
		setIsEditing(false);
	};

	return (
		<Stack sx={style.main}>
			<CTextFieldOutlined
				label="First Name"
				value={isEditing ? firstName : user?.firstName || ""}
				onChange={(e) => setFirstName(e.target.value)}
				disabled={!isEditing}
				sx={style.input}
				styling="neutral"
				fullWidth
			/>

			<CTextFieldOutlined
				label="Last Name"
				value={isEditing ? lastName : user?.lastName || ""}
				onChange={(e) => setLastName(e.target.value)}
				disabled={!isEditing}
				sx={style.input}
				styling="neutral"
				fullWidth
			/>

			<CTextFieldOutlined
				label="Username"
				value={isEditing ? username : user?.username || ""}
				onChange={(e) => setUsername(e.target.value)}
				disabled={!isEditing}
				sx={style.input}
				styling="neutral"
				fullWidth
			/>

			<Stack direction="row" sx={style.buttons}>
				{!isEditing ? (
					<CButtonText onClick={handleEdit}>Edit Profile</CButtonText>
				) : (
					<>
						<CButtonText onClick={handleCancel} styling="cancel">
							Cancel
						</CButtonText>
						<CButtonText onClick={handleSave}>Save Changes</CButtonText>
					</>
				)}
			</Stack>
		</Stack>
	);
}

export default PProfileInformation;
