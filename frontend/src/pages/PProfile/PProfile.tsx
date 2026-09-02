import type { GPageProps } from "../../../rgt/pages/shared/pageCommon";
import { Stack } from "@mui/material";
import CDrawerMenu from "../../../rgt/components/navigation/drawers/CDrawerMenu";
import { InfoRounded, ContactMailRounded, SecurityRounded } from "@mui/icons-material";
import { useState } from "react";
import PProfileInformation from "./components/PProfileInformation";
import PProfileContact from "./components/PProfileContact";
import PProfileSecurity from "./components/PProfileSecurity";
import CTitle from "../../../rgt/components/text/CTitle";
import type { TListMenuCompData } from "../../../rgt/components/data/lists/subs/CListMenuComp";


export interface PProfileProps extends GPageProps {}

const profileMenuItems: TListMenuCompData[] = [
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
					<Stack sx={{ flex: 1 }}>
						{currentMenu === "information" && <PProfileInformation />}
						{currentMenu === "contact" && <PProfileContact />}
						{currentMenu === "security" && <PProfileSecurity />}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default PProfile;
