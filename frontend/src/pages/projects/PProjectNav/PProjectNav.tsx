import { Outlet } from "react-router";
import {
	HomeRounded,
	FolderRounded,
	ChecklistRounded,
	BugReportRounded,
	RouteRounded,
	SettingsRounded,
	TuneRounded,
} from "@mui/icons-material";
import CDrawerMenu from "../../../../rgt/components/navigation/drawers/CDrawerMenu";
import type { TListMenuCompData } from "../../../../rgt/components/data/lists/subs/CListMenuComp";
import type { TListMenuGroupData } from "../../../../rgt/components/data/lists/subs/CListMenuGroup";
import { Stack } from "@mui/material";

//--------------------------------------------------
//                     SECTIONS 
//--------------------------------------------------
export const EProjectSections = {
	home: "home",
	project: "project",
	todo: "todo",
	bugs: "bugs",
	roadmap: "roadmap",
	settings: "settings",
	options: "options",
} as const satisfies Record<string, string>;

export const DProjectMenuComp: TListMenuCompData[] = [
	{
		value: EProjectSections.home,
		display: "Home",
		icon: <HomeRounded />,
		color: {normal: "secondary"},
	},
];

export const DProjectMenuGroups: TListMenuGroupData[] = [
	{
		value: EProjectSections.project,
		display: "Project",
		icon: <FolderRounded />,
		color: {normal: "tertiary"},
		comps: [
			{
				value: EProjectSections.todo,
				display: "Todo",
				icon: <ChecklistRounded />,
			},
			{
				value: EProjectSections.bugs,
				display: "Bugs",
				icon: <BugReportRounded />,
			},
			{
				value: EProjectSections.roadmap,
				display: "Roadmap",
				icon: <RouteRounded />,
			},
		],
	},
	{
		value: EProjectSections.settings,
		display: "Settings",
		icon: <SettingsRounded />,
		color: {normal: "grey"},
		comps: [
			{
				value: EProjectSections.options,
				display: "Options",
				icon: <TuneRounded />,
			},
		],
	},
];


//--------------------------------------------------
//                       NODE
//--------------------------------------------------
export interface PProjectNavProps {

}

function PProjectNav({}: PProjectNavProps) {

	return <Stack direction={"row"} sx={{ flex: 1, overflow: "hidden"}} >
		 <CDrawerMenu comps={DProjectMenuComp} groups={DProjectMenuGroups}/>
	</Stack>
}

export default PProjectNav;