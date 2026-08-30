import type { GPageProps } from "../../../rgt/pages/shared/pageCommon";
import { Stack } from "@mui/material";
import CDrawerMenu from "../../../rgt/components/navigation/drawers/CDrawerMenu";
import { InfoRounded, ContactMailRounded, SecurityRounded } from "@mui/icons-material";
import { useState } from "react";
import PProfileInformation from "./components/PProfileInformation";
import PProfileContact from "./components/PProfileContact";
import PProfileSecurity from "./components/PProfileSecurity";
import CTitle from "../../../rgt/components/text/CTitle";
import CAvatar from "../../../rgt/components/images/CAvatar";
import { appTheme } from "../../style/theme";
import { useAuth } from "../../../rgt/context/auth/CAuthContext";
import CSplitterRow from "../../../rgt/components/splitters/CSplitterRow";

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
	const { user } = useAuth();

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
						sx={{ my: "auto", height: "70%" }}
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
						<CAvatar
							user={user ?? { uid: "guest", username: "Guest", initials: "G" }}
							src={user?.avatar || undefined}
							alt={user?.username || "Guest"}
							styling="light"
							sx={{
								width: 200,
								height: 200,
								fontSize: 52,
								border: `4px solid ${appTheme.colors.primary[3]}`,
							}}
						/>
						<CTitle size="sm" weight={7} sx={{ mt: 2, color: appTheme.colors.tertiary[7] }}>
							{user?.username || "Guest"}
						</CTitle>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default PProfile;
