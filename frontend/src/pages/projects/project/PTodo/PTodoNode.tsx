import { Stack } from "@mui/material";
import CText from "../../../../../rgt/components/text/CText";
import type { ITodo, TTodoState } from "../../../../types/data/project/TTodo";
import { useProject } from "../../../../context/CProjectContext";
import CSelectorButtonIcon from "../../../../../rgt/components/inputs/selectors/CSelectorButtonIcon";
import CSplitterRow from "../../../../../rgt/components/splitters/CSplitterRow";
import { useEffect, useRef, useState } from "react";
import { TIME_1D } from "../../../../../rgt/consts";
import CButtonIcon from "../../../../../rgt/components/inputs/buttons/CButtonIcon";
import CDateButton from "../../../../../rgt/components/inputs/buttons/popovers/CDateButton";
import CTagButton from "../../../../../rgt/components/inputs/buttons/popovers/CTagButton";
import CSliderButton, {
	type ISliderButtonEntry,
} from "../../../../../rgt/components/inputs/buttons/popovers/CSliderButton";
import { appTheme } from "../../../../style/theme";
import CAccordion from "../../../../../rgt/components/surfaces/CAccordion";
import type { TUID } from "../../../../../rgt/types/TShared";
import CTextFieldOutlined from "../../../../../rgt/components/inputs/text/CTextFieldOutlined";
import CTextFieldOutlinedMultiline from "../../../../../rgt/components/inputs/text/CTextFieldOutlinedMultiline";
import type { TCardStyling } from "../../../../../rgt/style/components/surfaces/CCardStyle";
import type { TButtonStylingTypes } from "../../../../../rgt/style/components/inputs/buttons/CButtonStyle";

const importanceEntries: ISliderButtonEntry[] = [
	{
		value: 0,
		display: "---",
		color: appTheme.colors.valid[5],
	},
	{
		value: 1,
		display: "-",
		color: appTheme.colors.valid[7],
	},
	{
		value: 2,
		display: "~",
		color: appTheme.colors.warning[6],
	},
	{
		value: 3,
		display: "!",
		color: appTheme.colors.error[7],
	},
	{
		value: 4,
		display: "!!!",
		color: appTheme.colors.error[5],
	},
];

const difficultyEntries: ISliderButtonEntry[] = [
	{
		value: 0,
		display: "Very easy",
		color: appTheme.colors.valid[5],
	},
	{
		value: 1,
		display: "Easy",
		color: appTheme.colors.valid[7],
	},
	{
		value: 2,
		display: "Medium",
		color: appTheme.colors.warning[6],
	},
	{
		value: 3,
		display: "Hard",
		color: appTheme.colors.error[7],
	},
	{
		value: 4,
		display: "Vary hard",
		color: appTheme.colors.error[5],
	},
];

export interface PTodoNodeProps {
	todo: ITodo;

	onEdit: (uid: TUID, data: Partial<ITodo>) => Promise<boolean>
	onStateChange: (uid: TUID, state: TTodoState) => void
	onDelete: (todo: ITodo) => void
}

function PTodoNode({ todo, onEdit, onStateChange, onDelete}: PTodoNodeProps) {
	//====================== DATA ======================
	const { usersEntries, groupEntries } = useProject();
	const [editTodo, setEditTodo] = useState<Partial<ITodo | undefined>>(undefined);
	

	const [now] = useState<number>(() => new Date().setHours(0, 0, 0, 0));
	const dateDelta = ((editTodo?.date ?? todo.date).setHours(0, 0, 0, 0) - now) / TIME_1D;

	const nameEditRef = useRef<HTMLInputElement | null>(null)
	const isEditingName = editTodo?.name != undefined

	//====================== HANDLERS ======================
		//Main
	const isEditValid = (): boolean => {
		if(editTodo?.name != undefined)
		{
			const trimmed = editTodo.name.trim()
			if(!trimmed)
				return false;
		}
		return true
	}

		//Selects
	const handleSelect = (value: string, target: "groups" | "users") => {
		setEditTodo((prev) => {
			if (!prev)
				return {
					[target]: [value],
				};
			return {
				...prev,
				[target]: prev[target] ? [...prev[target], value] : [value],
			};
		});
	};
	const handleUnselect = (value: string, target: "groups" | "users") => {
		setEditTodo((prev) => {
			if (!prev) return undefined;
			return {
				...prev,
				[target]: prev[target]
					? [...prev[target].filter((uid) => uid != value)]
					: undefined,
			};
		});
	};

		//Name
	const handleNameChange = (name?: string) => {
		setEditTodo((prev) => {
			return {
				...(prev ?? {}),
				name: name ?? todo.name,
			};
		});
	}

		//Desc
	const handleDescChange = (desc?: string) => {
		setEditTodo((prev) => {
			return {
				...(prev ?? {}),
				desc: desc ?? todo.desc,
			};
		});
	}

		//Date
	const handleDateChange = (date: Date) => {
		setEditTodo((prev) => {
			return {
				...(prev ?? {}),
				date: date,
			};
		});
	};
	const handleTagChanged = (values: string[]) => {
		setEditTodo((prev) => {
			return {
				...(prev ?? {}),
				tags: values,
			};
		});
	};

		//Slides
	const handleSlides = (values: number, target: "importance" | "difficulty") => {
		setEditTodo((prev) => {
			return {
				...(prev ?? {}),
				[target]: values,
			};
		});
	};
	useEffect(() => {
		if(isEditingName)
			nameEditRef.current?.select()
	}, [isEditingName])

		//Edit
	const handleEdit = async () => {
		if(!editTodo || !isEditValid())
			return;
		if(await onEdit(todo.uid, editTodo))
			setEditTodo(undefined);
	};

	const handleCancelEdit = () => {
		setEditTodo(undefined);
	};

	//====================== HELPERS ======================
	const getDateLabel = (): string => {
		if(dateDelta < 0)
			return `${dateDelta * -1} day${dateDelta == -1 ? "" : "s"} late`
		if(dateDelta > 0)
			return `${dateDelta} day${dateDelta == -1 ? "" : "s"} left`
		return "Today"
	}
	const getCardAccent = (): TCardStyling | undefined => {
		if(todo.state == "done")
			return "grey"
		if(todo.state == "canceled")
			return "error-dark-grey"
		if(dateDelta < 0)
			return "error-dark"
		if(dateDelta > 0)
			return undefined
		return "warning"
	}
	const getSelectorAccent = (): string | undefined => {
		if(todo.state != "current")
			return appTheme.colors.greys[7]
		if(dateDelta < 0)
			return appTheme.colors.error[4] 
		if(dateDelta > 0)
			return undefined
		return appTheme.colors.warning[6] 
	}
	const getButtonAccent = (): TButtonStylingTypes | undefined => {
		if(dateDelta < 0)
			return "cancel"
		if(dateDelta > 0)
			return undefined
		return "warning"
	}

	return (
		<CAccordion
			styling={getCardAccent()}
			openOnButton
			header={
				<Stack direction={"row"} spacing={"10px"} sx={{ alignItems: "center", flex: 1 }}>
					<CSelectorButtonIcon
						disabled={todo.state != "current"}
						sx={{ minWidth: "110px" }}

						emptyText="No user"
						emptyColor={getSelectorAccent()}
						entries={usersEntries}
						values={editTodo?.users ?? todo.users}
						onSelected={(value) => {
							handleSelect(value, "users");
						}}
						onUnselected={(value) => {
							handleUnselect(value, "users");
						}}
					/>
					<CSelectorButtonIcon
						disabled={todo.state != "current"}
						sx={{ minWidth: "110px" }}
						
						emptyText="No category"
						emptyColor={getSelectorAccent()}
						entries={groupEntries}
						values={editTodo?.groups ?? todo.groups}
						onSelected={(value) => {
							handleSelect(value, "groups");
						}}
						onUnselected={(value) => {
							handleUnselect(value, "groups");
						}}
					/>
					<CSplitterRow />
					<CDateButton 
						disabled={todo.state != "current"} justifyContent={"center"} customText={todo.state == "current" ? getDateLabel() : undefined} styling={getButtonAccent()} onChange={handleDateChange} value={editTodo?.date ?? todo.date} sx={{textTransform: "none", minWidth: "115px"}}/>
					<CSplitterRow />
					{editTodo?.name != undefined && <CTextFieldOutlined inputRef={nameEditRef} onChange={(e) =>  handleNameChange(e.target.value)} value={editTodo.name} sx={{ flex: 1 }} />}
					{editTodo?.name == undefined && <CText sx={{ textDecoration: todo.state == "current" ? undefined : "line-through", color: todo.state == "current" ? undefined : (todo.state == "done" ? appTheme.colors.greys[7] : appTheme.colors.error[5]),  flex: 1 }}>{todo.name}</CText>}
					{editTodo?.name == undefined && todo.state == "current" &&<CButtonIcon  styling={getButtonAccent()} icon="edit" size="sm" onClick={() => handleNameChange()}/>}
					<CSplitterRow />
					<CTagButton
						disabled={todo.state != "current"}
						sx={{ minWidth: "110px" }} values={editTodo?.tags ?? todo.tags} onChange={handleTagChanged} 
						emptyColor={getSelectorAccent()} />
					<CSliderButton
						disabled={todo.state != "current"}
						textProps={{ weight: 7, size: "sm" }}
						onChange={(value) => handleSlides(value, "importance")}
						value={editTodo?.importance ?? todo.importance}
						entries={importanceEntries}
					/>
					<CSliderButton
						disabled={todo.state != "current"}
						textProps={{ weight: 6, size: "xs" }}
						sx={{ minWidth: "100px" }}
						onChange={(value) => handleSlides(value, "difficulty")}
						value={editTodo?.difficulty ?? todo.difficulty}
						entries={difficultyEntries}
					/>
					<CSplitterRow />
					{editTodo && <CButtonIcon disabled={!isEditValid()} onClick={handleEdit} icon="tick" styling="validate" size="sm" />}
					{editTodo && (
						<CButtonIcon
							icon="clear"
							styling={"cancel"}
							size="sm"
							onClick={handleCancelEdit}
						/>
					)}
					{!editTodo && todo.state == "current" && <CButtonIcon icon="done" padding={"5px"} styling={"validate"} size="lg" onClick={() => onStateChange?.(todo.uid, "done")} />}
					{!editTodo && todo.state == "current" && <CButtonIcon icon="cancel" padding={"5px"} size="lg" styling={"cancel"} onClick={() => onStateChange?.(todo.uid, "canceled")}/>}
					{!editTodo && todo.state != "current" && <CButtonIcon icon="reset" padding={"5px"} size="lg" styling={"secondary-medium"} onClick={() => onStateChange?.(todo.uid, "current")}/>}
					{!editTodo && <CButtonIcon onClick={() => onDelete(todo)} icon="delete" styling={"cancel"} size="sm" />}
				</Stack>
			}
		>
			<Stack direction={"row"} sx={{alignItems: "flex-start"}}>
				{editTodo?.desc == undefined && <CText mutliline sx={{flex: 1}}>{(editTodo?.desc ?? todo.desc) ? (editTodo?.desc ?? todo.desc) : "No description" }</CText>}
				{editTodo?.desc == undefined && todo.state == "current" && <CButtonIcon size="md" icon={"edit"} onClick={() => handleDescChange()}/>}
				{editTodo?.desc != undefined && <CTextFieldOutlinedMultiline value={editTodo.desc} onChange={(e) => {handleDescChange(e.target.value)}} rows={20} sx={{flex: 1}} />}
			</Stack>
		</CAccordion>
	);
}

export default PTodoNode;
