import { useMemo } from "react";
import type { IHorizontalFlowEntry } from "../../../types/components/flow/CHorizontalTree";
import type { CFlowBaseProps } from "../CFlowBase";
import CFlowBase from "../CFlowBase";
import type { IFlowNode } from "../CFlowNode";

//====================== COMPONENTS ======================
export interface CHorizontalSkillTreeProps extends Omit<CFlowBaseProps, "nodes"> {
	entries: IHorizontalFlowEntry[];
}

function CHorizontalTree({ entries, ...other }: CHorizontalSkillTreeProps) {
	const nodes: IFlowNode[] = useMemo(() => {
		return entries.map((entry: IHorizontalFlowEntry): IFlowNode => {
			return {
				component: entry.component,
			};
		});
	}, [entries]);

	return <CFlowBase {...other} nodes={nodes} />;
}

export default CHorizontalTree;
