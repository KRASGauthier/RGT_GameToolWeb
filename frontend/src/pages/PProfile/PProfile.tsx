import type { GPageProps } from "../../../rgt/pages/shared/pageCommon";
import { Stack } from "@mui/material";
import CDrawerMenu from "../../../rgt/components/navigation/drawers/CDrawerMenu";
import { InfoRounded, ContactMailRounded, SecurityRounded } from "@mui/icons-material";
import { useRef, useState, type ChangeEvent } from "react";
import PProfileInformation from "./components/PProfileInformation";
import PProfileContact from "./components/PProfileContact";
import PProfileSecurity from "./components/PProfileSecurity";
import CTitle from "../../../rgt/components/text/CTitle";
import CAvatar from "../../../rgt/components/images/CAvatar";
import { appTheme } from "../../style/theme";
import { useAuth } from "../../../rgt/context/auth/CAuthContext";
import CSplitterRow from "../../../rgt/components/splitters/CSplitterRow";
import { useNotif } from "../../../rgt/context/app/CAppNotifContext";
import { apiUserUploadAvatar } from "../../../rgt/api/user/userAPI";
import CButtonText from "../../../rgt/components/inputs/buttons/CButtonText";

export interface PProfileProps extends GPageProps {}

const profileMenuItems = [
	{
		value: "information",
		display: "Information",
		icon: <InfoRounded />,
		color: { normal: "secondary" },
	},
	{
		value: "contact",
		display: "Contact",
		icon: <ContactMailRounded />,
		color: { normal: "secondary" },
	},
	{
		value: "security",
		display: "Security",
		icon: <SecurityRounded />,
		color: { normal: "secondary" },
	},
];

function PProfile({}: PProfileProps) {
	const [currentMenu, setCurrentMenu] = useState<string>("information");
	const { user, refresh } = useAuth();
	const { push } = useNotif();
	const avatarInputRef = useRef<HTMLInputElement | null>(null);

	if (!user) return null;

	const handleAvatarClick = () => {
		avatarInputRef.current?.click();
	};

	const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const input = event.currentTarget;
		const file = input.files?.[0];
		if (!file) return;

		try {
			const updatedUser = await apiUserUploadAvatar(file, push);
			if (updatedUser) await refresh();
		} finally {
			input.value = "";
		}
	};

	return (
		<Stack direction="row" sx={{ flex: 1 }}>
			<CDrawerMenu
				value={currentMenu}
				onValueChange={setCurrentMenu}
				comps={profileMenuItems}
				groups={[]}
			/>
			<Stack sx={{ flex: 1, p: 2, gap: 2 }}>
				<CTitle size="md" weight={6} sx={{ textTransform: "capitalize" }}>
					{currentMenu}
				</CTitle>
				<Stack direction="row" sx={{ flex: 1, gap: 3, alignItems: "stretch" }}>
					<Stack sx={{ flex: 1, minWidth: 0 }}>
						{currentMenu === "information" && <PProfileInformation />}
						{currentMenu === "contact" && <PProfileContact />}
						{currentMenu === "security" && <PProfileSecurity />}
					</Stack>

					<CSplitterRow
						color={appTheme.colors.primary[2]}
						elevation={20}
						sx={{ my: "auto", height: "100%" }}
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
								src={user.avatar || undefined}
								alt={user.username}
								styling="light"
								sx={{
									width: 200,
									height: 200,
									fontSize: 52,
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
							sx={{ mt: 1.5, px: 1.5, py: 0.75, minWidth: 0, borderRadius: 1 }}
						>
							Upload photo
						</CButtonText>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default PProfile;
