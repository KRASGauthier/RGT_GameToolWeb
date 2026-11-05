import { Stack } from "@mui/material";
import CFilter from "../../../../../rgt/components/inputs/filters/CFilter";
import { appTheme } from "../../../../style/theme";
import { useState } from "react";
import { apiTodoAdd } from "../../../../api/project/todoAPI";
import { useProject } from "../../../../context/CProjectContext";
import { useNotif } from "../../../../../rgt/context/app/CAppNotifContext";
import type { ITodo } from "../../../../types/data/project/TTodo";

export interface PTodoProps {

}

function PTodo({}: PTodoProps) {

	//====================== DATA ======================
	const { project } = useProject();
	const [todos, setTodos] = useState<ITodo[]>([])

	const { push } = useNotif();

	//====================== EVENTS ======================
	

	//====================== HANDLERS ======================
	const handleEvent = async (event: string) => {
		if(!project)
			return;
		switch(event) {
			case "add":
				apiTodoAdd(project.uid, setTodos, push)
		}
	}

	//====================== NODES ======================
	return <Stack sx={{ flex: 1, m: appTheme.shapes.spacing.main, overflow: "hidden" }}>
		<CFilter 
			actions={["add"]}
			onEvent={handleEvent}	
		/>
	</Stack>
}

export default PTodo;