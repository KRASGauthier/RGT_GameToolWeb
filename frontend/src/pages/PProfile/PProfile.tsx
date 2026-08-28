import type { GPageProps } from "../../../rgt/pages/shared/pageCommon";
import { Stack } from "@mui/material";
import CDrawerMenu from "../../../rgt/components/navigation/drawers/CDrawerMenu";
import {
	InfoRounded,
	ContactMailRounded,
	SecurityRounded,
} from "@mui/icons-material";
import { useState } from "react";
import PProfileInformation from "./components/PProfileInformation";
import PProfileContact from "./components/PProfileContact";
import PProfileSecurity from "./components/PProfileSecurity";

export interface PProfileProps extends GPageProps {}

const profileMenuItems = [
	{
		value: "Information",
		display: "Information",
		icon: <InfoRounded />,
		color: { normal: "secondary" },
	},
	{
		value: "Contact",
		display: "Contact",
		icon: <ContactMailRounded />,
		color: { normal: "secondary" },
	},
	{
		value: "Security",
		display: "Security",
		icon: <SecurityRounded />,
		color: { normal: "secondary" },
	},
];

function PProfile({}: PProfileProps) {
	
	const [currentMenu, setCurrentMenu] = useState<string>("Profile Page");

	return (
		<Stack direction="row" sx={{ position: "fixed", inset: 0 }}>
			<CDrawerMenu
				value={currentMenu}
				onValueChange={setCurrentMenu}
				comps={profileMenuItems}
				groups={[]}
			/>
			<Stack sx={{ flex: 1, p: 2 }}>
				<h1>{currentMenu}</h1>
				{currentMenu === "Information" && <PProfileInformation />}
				{currentMenu === "Contact" && <PProfileContact />}
				{currentMenu === "Security" && <PProfileSecurity/>}
			</Stack>
		</Stack>
	);
}

export default PProfile;