import { Box } from "@mui/material";
import type { GCompProps } from "../shared/ccommon";
import type { IFlowNode } from "./CFlowNode";

export interface CFlowBaseProps extends GCompProps {
	nodes: IFlowNode[];
}

function CFlowBase({ nodes }: CFlowBaseProps) {
	return (
		<Box sx={{ width: "100%", height: "100%" }}>
			{nodes.map((node: IFlowNode) => {
				return node.component;
			})}
		</Box>
	);
}

export default CFlowBase;
