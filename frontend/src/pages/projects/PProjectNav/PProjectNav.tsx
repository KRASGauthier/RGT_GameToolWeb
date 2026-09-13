import { generatePath, Navigate, useNavigate, useParams } from "react-router";
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
import { ROUTE_PROJECT, ROUTE_PROJECT_ID, ROUTE_PROJECT_SECCTION } from "../../../consts";
import { useMemo } from "react";
import PProjectSettings from "../project/PProjectSettings/PProjectSettings";
import CProjectProvider from "../../../context/CProjectContext";
import PProjectTodo from "../project/PProjectTodo/PProjectTodo";

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
		color: { normal: "secondary" },
	},
];

export const DProjectMenuGroups: TListMenuGroupData[] = [
	{
		value: EProjectSections.project,
		display: "Project",
		icon: <FolderRounded />,
		color: { normal: "tertiary" },
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
		color: { normal: "grey" },
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
export interface PProjectNavProps {}

function PProjectNavSub({}: PProjectNavProps) {
	//====================== DATA ======================
	const { tab, section } = useParams();
	const navigate = useNavigate();

	//====================== FUNCTIONS ======================
	const handleChange = (value: string) => {
		navigate(
			generatePath(ROUTE_PROJECT + ROUTE_PROJECT_ID + ROUTE_PROJECT_SECCTION, {
				tab,
				section: value,
			}),
		);
	};
	const current = useMemo(() => {
		switch (section) {
			case EProjectSections.options:
				return <PProjectSettings />;
			case EProjectSections.todo:
				return <PProjectTodo />;
		}
	}, [section]);

	if (!section)
		return (
			<Navigate
				to={generatePath(ROUTE_PROJECT + ROUTE_PROJECT_ID + ROUTE_PROJECT_SECCTION, {
					tab,
					section: EProjectSections.home,
				})}
			/>
		);
	return (
		<Stack direction={"row"} sx={{ flex: 1, overflow: "hidden" }}>
			<CDrawerMenu
				saveID="projectMenu"
				onValueChange={handleChange}
				value={section}
				comps={DProjectMenuComp}
				groups={DProjectMenuGroups}
			/>
			{current}
		</Stack>
	);
}

function PProjectNav({ ...other }: PProjectNavProps) {
	return (
		<CProjectProvider>
			<PProjectNavSub {...other} />
		</CProjectProvider>
	);
}

export default PProjectNav;
