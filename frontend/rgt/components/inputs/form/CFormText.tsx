import type { CFormSubComponentProps } from "./CFormComponent";
import CFormComponent from "./CFormComponent";

export interface CFormTextProps extends CFormSubComponentProps {}

function CFormText({ ...other }: CFormTextProps) {
	return <CFormComponent type="text" {...other} />;
}

export default CFormText;
