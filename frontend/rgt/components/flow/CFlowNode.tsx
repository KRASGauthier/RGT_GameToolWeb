import type { ReactNode } from "react";
import type { GCompProps } from "../shared/ccommon";

//====================== TYPES ======================
export interface IFlowNode {
	component: ReactNode;
}

//====================== COMPONENTS ======================
export interface CFlowNodeProps extends GCompProps {
	node: IFlowNode;
}

function CFlowNode({ node }: CFlowNodeProps) {
	return node.component;
}

export default CFlowNode;
