import type { CSplitterProps } from "./CSplitter";
import CSplitter from "./CSplitter";

export interface CSplitterRowPorps extends Omit<CSplitterProps, "position"> {}

function CSplitterRow({ ...other }: CSplitterRowPorps) {
	return <CSplitter position="row" {...other}></CSplitter>;
}

export default CSplitterRow;
