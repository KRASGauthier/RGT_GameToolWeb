import type { GPageProps } from "../../../rgt/pages/shared/pageCommon";
import { Stack } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router";
import CDrawerMenu from "../../../rgt/components/navigation/drawers/CDrawerMenu";
import {
	HomeRounded,
	DashboardRounded,
	ChecklistRounded,
	TimelineRounded,
	BugReportRounded,
	PersonRounded,
} from "@mui/icons-material";
import type { TListMenuGroupData } from "../../../rgt/components/data/lists/subs/CListMenuGroup";
import { EAppMenus } from "../../consts";


export interface PBasePageProps extends GPageProps {}

const groups: TListMenuGroupData[] = [
	{
		value: "management",
		display: "Management",
		color: { normal: "primary" },
		icon: <DashboardRounded />,
		comps: [
			{
				value: EAppMenus.MANAGEMENT_TODO,
				display: "Todo",
				icon: <ChecklistRounded />,
			},
			{
				value: EAppMenus.MANAGEMENT_ROADMAP,
				display: "Roadmap",
				icon: <TimelineRounded />,
			},
			{
				value: EAppMenus.MANAGEMENT_BUGS,
				display: "Bugs",
				icon: <BugReportRounded />,
			},
		],
	},
];

function PBasePage({}: PBasePageProps) {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const currentMenu = pathname == "/" ? EAppMenus.HOME : pathname.split("/")[1];

	//ANDLES
	const handleNavigate = (toward: string) => {
		navigate("/" + (toward == EAppMenus.HOME ? "" : toward));
	};

	return (
		<Stack direction="row" sx={{ position: "fixed", inset: 0 }}>
			<CDrawerMenu
				onValueChange={handleNavigate}
				value={currentMenu}
				comps={[
					{
						color: { normal: "secondary" },
						value: EAppMenus.HOME,
						display: "Home",
						icon: <HomeRounded />,
					},
					{
						color: { normal: "secondary" },
						value: EAppMenus.PROFILE,
						display: "Profile",
						icon: <PersonRounded />,
					},
				]}
				groups={groups}
			></CDrawerMenu>
			<Outlet />
		</Stack>
	);
}

export default PBasePage;
