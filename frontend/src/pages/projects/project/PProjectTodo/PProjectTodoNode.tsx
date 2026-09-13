import { Stack } from "@mui/material";
import CCard from "../../../../../rgt/components/surfaces/CCard";
import type { GPageProps } from "../../../../../rgt/pages/shared/pageCommon";
import type { ITodo } from "../../../../types/data/project/TTodo";
import CText from "../../../../../rgt/components/text/CText";

export interface PProjectTodoNodeProps extends GPageProps {
	todo: ITodo
}

function PProjectTodoNode({todo}: PProjectTodoNodeProps) {
	return <CCard>
		<Stack direction={"row"}>
			<CText>{todo.name}</CText>
		</Stack>
	</CCard>
}

export default PProjectTodoNode;