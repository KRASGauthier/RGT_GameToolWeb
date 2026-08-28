import type { GCompProps } from "../../../../rgt/components/shared/ccommon";
import { Stack } from "@mui/material";
import CText from "../../../../rgt/components/text/CText";
import CTextFieldOutlined from "../../../../rgt/components/inputs/text/CTextFieldOutlined";
import CButtonText from "../../../../rgt/components/inputs/buttons/CButtonText";
import { PProfileStyle } from "../../../style/pages/profiles/PProfileStyle";
import { useState, useEffect } from "react";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import { apiUserGetFullSelf } from "../../../../rgt/api/user/userAPI";
import type { IUserFull } from "../../../../rgt/types/data/TUser";
import { API_PROFILE } from "../../../consts";
import { apiCheckReponse, apiPatchData } from "../../../../rgt/api/shared";

export interface PProfileInformationProps extends GCompProps {}


function PProfileContact({}: PProfileInformationProps) {

    const { push } = useNotif();
    const [user, setUser] = useState<IUserFull | undefined>(undefined);
    const style = PProfileStyle();
    const [email, setEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
            apiUserGetFullSelf(setUser, push);
        }, [push]);

    const handleCancel = () => {setIsEditing(false)};
    const handleEdit = () => {
		if (!user) return;
		setEmail(user.email || "");
		setIsEditing(true);
	};

	const handleSave = async () => {
		if (!user) return;
		const response = await apiPatchData<{ email: string }, { user: IUserFull }>(
			API_PROFILE,
			{ email },
			"notif",
		);
		if (!apiCheckReponse(response, "user", { type: "notif", handler: push })) return;
		if (!response.data) return;
		setUser(response.data.user);
		setIsEditing(false);
		push({ severity: "success", message: "Email updated." });
	};

    return (
        <Stack sx={style.main}>
			<CText>Email:</CText>
			<CTextFieldOutlined
				value={isEditing ? email : user?.email || ""}
				onChange={(e) => setEmail(e.target.value)}
				disabled={!isEditing}
				sx={style.input}
				fullWidth
			/>

            <Stack direction="row" sx={style.buttons}>
				{!isEditing ? (
					<CButtonText onClick={handleEdit}>
						Edit Profile
					</CButtonText>
				) : (
					<>
						<CButtonText onClick={handleCancel} sx={{ color: "error.main" }}>
							Cancel
						</CButtonText>
						<CButtonText onClick={handleSave} sx={{ color: "primary.main" }}>
							Save Changes
						</CButtonText>
					</>
				)}
			</Stack>

        </Stack>
    );
}
export default PProfileContact;