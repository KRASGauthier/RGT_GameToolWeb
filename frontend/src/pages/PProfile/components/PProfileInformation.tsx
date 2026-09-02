import type { GCompProps } from "../../../../rgt/components/shared/ccommon";
import { Stack } from "@mui/material";
import CTextFieldOutlined from "../../../../rgt/components/inputs/text/CTextFieldOutlined";
import CButtonText from "../../../../rgt/components/inputs/buttons/CButtonText";
import { useState, useEffect, useRef, type ChangeEvent, useMemo } from "react";
import { apiUserGetFullSelf, apiUserPatchSelf, apiUserUploadAvatar } from "../../../../rgt/api/user/userAPI";
import { useNotif } from "../../../../rgt/context/app/CAppNotifContext";
import type { IUserFull } from "../../../../rgt/types/data/TUser";
import { PProfileStyle } from "../../../style/pages/profiles/PProfileStyle";
import CSplitterRow from "../../../../rgt/components/splitters/CSplitterRow";
import { appTheme } from "../../../style/theme";
import CAvatar from "../../../../rgt/components/images/CAvatar";
import CTitle from "../../../../rgt/components/text/CTitle";

export interface PProfileInformationProps extends GCompProps {}

function PProfileInformation({}: PProfileInformationProps) {


	//====================== DATA ======================
	const [user, setUser] = useState<IUserFull | undefined>(undefined);
	
	const { push } = useNotif();

	const [changes, setChanges] = useState<Partial<Pick<IUserFull, "firstName" | "lastName" | "username">>>({});
	const hasChanges = Object.keys(changes).length > 0;
	const avatarInputRef = useRef<HTMLInputElement | null>(null);
	
	const style = useMemo(() => {
		return PProfileStyle()
	}, []);

	
	//====================== EFFECT ======================
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


	const handleAvatarClick = () => {
		avatarInputRef.current?.click();
	};

	const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const input = event.currentTarget;
		const file = input.files?.[0];
		if (!file) return;
		apiUserUploadAvatar(file, setUser, push);
	};

	if (!user) return null;

	return (
		<Stack direction={"row"} sx={{ flex: 1}}>
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
