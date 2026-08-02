import type { CSplitterProps } from "./CSplitter";
import CSplitter from "./CSplitter";

export interface CSplitterCollumnPorps extends Omit<CSplitterProps, "position"> {}

function CSplitterCollumn({ ...other }: CSplitterCollumnPorps) {
	return <CSplitter position="column" {...other}></CSplitter>;
}

export default CSplitterCollumn;
