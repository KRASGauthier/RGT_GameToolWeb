import {
	HomeRounded,
	FolderRounded,
	ChecklistRounded,
	BugReportRounded,
	RouteRounded,
	SettingsRounded,
	TuneRounded,
	PersonRounded,
	GroupsRounded,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import AddIcon from "@mui/icons-material/Add";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";

import type { SvgIconComponent } from "@mui/icons-material";

//LOCAL CONSTS
export const DIconLibrary = {
	//--------------------- PROJECT ---------------------
	home: HomeRounded,
	project: FolderRounded,
	todo: ChecklistRounded,
	bugs: BugReportRounded,
	roadmap: RouteRounded,

	//--------------------- SETTINGS ---------------------
	settings: SettingsRounded,
	options: TuneRounded,
	users: PersonRounded,
	groups: GroupsRounded,

	//--------------------- ACTIONS ---------------------
	add: AddIcon,
	edit: EditIcon,
	delete: DeleteIcon,
	search: SearchRoundedIcon,

	//--------------------- FEEDBACK ----------------------
	tick: DoneRoundedIcon,
	clear: ClearRoundedIcon,
	upArrow: ArrowUpwardRoundedIcon,
	downArrow: ArrowDownwardRoundedIcon,
} satisfies Record<string, SvgIconComponent>;

export type TIconLibrary = keyof typeof DIconLibrary;
