import { Stack } from "@mui/material";
import CFilter from "../../../../../rgt/components/inputs/filters/CFilter";
import { appTheme } from "../../../../style/theme";
import { useEffect, useState } from "react";
import { apiTodoAdd, apiTodoDelete, apiTodoEdit, apiTodoGet, apiTodoSetState } from "../../../../api/project/todoAPI";
import { useProject } from "../../../../context/CProjectContext";
import { useNotif } from "../../../../../rgt/context/app/CAppNotifContext";
import type { ITodo, TTodoState } from "../../../../types/data/project/TTodo";
import PTodoNode from "./PTodoNode";
import type { TUID } from "../../../../../rgt/types/TShared";
import CDialogConfirm from "../../../../../rgt/components/feedback/dialogs/CDialogConfirm";

export interface PTodoProps {}

function PTodo({}: PTodoProps) {
	//====================== DATA ======================
	const { project } = useProject();
	const [todos, setTodos] = useState<ITodo[]>([]);
	const [toDelete, setToDelete] = useState<ITodo | undefined>()

	const { push } = useNotif();

	//====================== EVENTS ======================
	useEffect(() => {
		if (!project) return;
		apiTodoGet(project.uid, setTodos, push);
	}, [project, push]);

	//====================== HANDLERS ======================
	const handleEvent = async (event: string) => {
		if (!project) return;
		switch (event) {
			case "add":
				apiTodoAdd(project.uid, setTodos, push);
		}
	};

	const handleEdit = async (uid: TUID, todo: Partial<ITodo>): Promise<boolean> => {
		if(!project)
			return false;
		return apiTodoEdit(project.uid, uid, todo, setTodos, push)
	}
	const handleStateChange = async (uid: TUID, state: TTodoState) => {
		if(!project)
			return false;
		apiTodoSetState(project.uid, uid, state, setTodos, push)
	}

	const handleOnRequestDelete = (todo: ITodo) => {
		if(!project)
			return
		if(todo.state != "current")
		{
			apiTodoDelete(project.uid, todo.uid, setTodos, push)
			setToDelete(undefined)
			return;
		}
		setToDelete(todo)
		return
	}
	const handleOnDelete = () => {
		if(!toDelete || !project)
			return
		apiTodoDelete(project.uid, toDelete.uid, setTodos, push)
		setToDelete(undefined)
	}

	//====================== NODES ======================
	return (
		<Stack spacing={"2px"} sx={{ flex: 1, m: appTheme.shapes.spacing.main, overflow: "hidden" }}>
			<CFilter actions={["add"]} onEvent={handleEvent} />
			{todos.map((todo: ITodo) => {
				return <PTodoNode onStateChange={handleStateChange} onEdit={handleEdit} onDelete={handleOnRequestDelete} todo={todo} />;
			})}
			<CDialogConfirm type={"Todo"} name={toDelete?.name} open={toDelete ? true : false} onYes={handleOnDelete} onNo={() => setToDelete(undefined)}/>
		</Stack>
	);
}

export default PTodo;
