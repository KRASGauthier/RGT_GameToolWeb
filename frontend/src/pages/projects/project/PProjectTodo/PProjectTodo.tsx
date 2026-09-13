import { Stack } from "@mui/material";
import type { GPageProps } from "../../../../../rgt/pages/shared/pageCommon";
import CPaper from "../../../../../rgt/components/surfaces/CPaper";
import { appTheme } from "../../../../style/theme";
import CButtonIconText from "../../../../../rgt/components/inputs/buttons/CButtonIconText";
import AddIcon from '@mui/icons-material/Add';
import { apiTodoCreate, apiTodoGet } from "../../../../api/project/todoAPI";
import { useNotif } from "../../../../../rgt/context/app/CAppNotifContext";
import type { ITodo } from "../../../../types/data/project/TTodo";
import { useProject } from "../../../../context/CProjectContext";
import { useEffect, useState } from "react";
import PProjectTodoNode from "./PProjectTodoNode";

export interface PProjectTodoProps extends GPageProps {

}

function PProjectTodo({}: PProjectTodoProps) {

	//====================== DATA ======================
	const [todos, setTodos] = useState<ITodo[]>([])
	const { push } = useNotif();
	const { project } = useProject()

	//====================== HANDLERS ======================
	const handleNewTodo = async () => {
		if(!project)
			return;
		const todo: ITodo | undefined = await apiTodoCreate(project.uid, push);
		if(!todo)
			return
		setTodos((prev) => {
			return [...prev, todo];
		})
	}

	//====================== EVENTS ======================
	useEffect(() => {
		if(!project)
			return;
		apiTodoGet(project.uid, push).then((res: ITodo[]) => {
			setTodos(res);
		})
	}, [project, push])


	//====================== NODES ======================
	return <Stack sx={{ flex: 1, px: appTheme.shapes.spacing.medium, py: appTheme.shapes.spacing.medium}}  direction={"column"}>
		<CPaper>
			<Stack direction={"row"}>
				<CButtonIconText  startIcon={<AddIcon />} onClick={handleNewTodo}>New</CButtonIconText>
			</Stack>
		</CPaper>
		<Stack direction={"column"}>
			{todos.map((todo: ITodo) => {
				return <PProjectTodoNode key={todo.uid} todo={todo} />
			})}
		</Stack>
	</Stack>
}

export default PProjectTodo;