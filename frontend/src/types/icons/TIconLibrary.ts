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
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import type { SvgIconComponent } from "@mui/icons-material";

//LOCAL CONSTS
export const DIconLibrary = {
	//--------------------- COMMON ---------------------
	tag: LocalOfferIcon,

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
	reset: RestartAltIcon,

	done: TaskAltIcon,
	cancel: HighlightOffIcon,

	//--------------------- FEEDBACK ----------------------
	tick: DoneRoundedIcon,
	clear: ClearRoundedIcon,
	upArrow: ArrowUpwardRoundedIcon,
	downArrow: ArrowDownwardRoundedIcon,
	leftArrowSmall: ArrowLeftRoundedIcon,
	rightArrowSmall: ArrowRightRoundedIcon,
	upArrowSmall: ArrowDropUpIcon,
	downArrowSmall: ArrowDropDownIcon,
} satisfies Record<string, SvgIconComponent>;

export type TIconLibrary = keyof typeof DIconLibrary;
