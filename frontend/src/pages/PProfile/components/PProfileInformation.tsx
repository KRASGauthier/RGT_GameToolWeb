import type { GCompProps } from "../../../../rgt/components/shared/ccommon";
import { Stack } from "@mui/material";
import CForm from "../../../../rgt/components/inputs/form/CForm";
import type { IFormEntry, TFormDataType } from "../../../../rgt/components/inputs/form/CForm";
import { useState, useEffect, useRef, type ChangeEvent, useMemo } from "react";
import { apiUserGetFullSelf, apiUserPatchSelf, apiUserUploadAvatar, apiUserCheckAvailable } from "../../../../rgt/api/user/userAPI";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import type { IUserFull } from "../../../../rgt/types/data/TUser";
import { PProfileStyle } from "../../../style/pages/profiles/PProfileStyle";
import CSplitterRow from "../../../../rgt/components/splitters/CSplitterRow";
import { appTheme } from "../../../style/theme";
import CAvatar from "../../../../rgt/components/images/CAvatar";
import CTitle from "../../../../rgt/components/text/CTitle";
import { AUTH_MAX_USER, AUTH_MIN_USER } from "../../../consts";
import CButtonText from "../../../../rgt/components/inputs/buttons/CButtonText";

export interface PProfileInformationProps extends GCompProps {}

function PProfileInformation({}: PProfileInformationProps) {

	//====================== DATA ======================
	const [user, setUser] = useState<IUserFull | undefined>(undefined);
	
	const { push } = useNotif();
	
	const avatarInputRef = useRef<HTMLInputElement | null>(null);
	
	//====================== EFFECT ======================
	useEffect(() => {
		apiUserGetFullSelf(setUser, push);
	}, [push]);
	
	const style = useMemo(() => {
		return PProfileStyle()
	}, []);

	const profileInfoEntries: IFormEntry[] = [
		{
			type: "text",
			label: "First name",
			filter: /^[ \u3000]*[\p{L}\p{M}]+(?:[ '\-・\u3000][\p{L}\p{M}]+)*[ \u3000]*$/u,
			max: 100,
			field: "firstName",
			required: true,
		},
		{
			type: "text",
			label: "Last name",
			filter: /^[ \u3000]*[\p{L}\p{M}]+(?:[ '\-・\u3000][\p{L}\p{M}]+)*[ \u3000]*$/u,
			max: 100,
			field: "lastName",
			required: true,
		},
		{
			type: "user",
			multiLang: true,
			max: AUTH_MAX_USER,
			min: AUTH_MIN_USER,
			field: "username",
			required: true,
		},
	];

	if (!user) return null;

	const handleUserCheck = async (username: string): Promise<boolean> => {
		if (username === user?.username) return true;
		return await apiUserCheckAvailable(username, push);
	};

	const handleSendEdit = async (data: TFormDataType): Promise<boolean> => {
		if (!user) return false;
		const updatedUser = await apiUserPatchSelf(data, push);
		if (!updatedUser) return false;
		setUser(updatedUser);
		push({ severity: "success", message: "Profile updated." });
		return true;
	};

	const handleAvatarClick = () => {
		avatarInputRef.current?.click();
	};

	const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const input = event.currentTarget;
		const file = input.files?.[0];
		if (!file) return;
		apiUserUploadAvatar(file, setUser, push);
	};



	return (
		<Stack direction={"row"} sx={{ flex: 1}}>
			<Stack sx={style.main}>
				<CForm
					entries={profileInfoEntries}
					values={{
						firstName: user.firstName ?? "",
						lastName: user.lastName ?? "",
						username: user.username,
					}}
					onSendEdit={handleSendEdit}
					onUsernameCheck={handleUserCheck}
					managedButtonPosition="flex-end"
				/>
			</Stack>
			<CSplitterRow
				color={appTheme.colors.primary[2]}
				elevation={20}
				secondSize={"100%"}
				sx={{ my: "auto"}}
			/>
			<Stack
				sx={{
					flex: 1,
					minWidth: 260,
					maxWidth: "50%",
					alignItems: "center",
					justifyContent: "flex-start",
					pt: 0,
					pb: 3,
					mt: -2,
				}}
			>
				<input
					type="file"
					accept="image/*"
					hidden
					ref={avatarInputRef}
					onChange={handleAvatarUpload}
				/>
				<Stack sx={{ alignItems: "center" }}>
					<CAvatar
						user={user}
						alt={user.username}
						styling="light"
						fontSize="3xl"
						sx={{
							width: 200,
							height: 200,
							border: `4px solid ${appTheme.colors.primary[3]}`,
						}}
					/>
					<CTitle size="sm" weight={7} sx={{ mt: 2, color: appTheme.colors.tertiary[7] }}>
						{user.username}
					</CTitle>
				</Stack>
				<CButtonText
					onClick={handleAvatarClick}
					styling="light"
					sx={{ mt: 1.5, px: 1.5, py: 0.75 }}
				>
					Upload photo
				</CButtonText>
			</Stack>
		</Stack>
	);
}

export default PProfileInformation;