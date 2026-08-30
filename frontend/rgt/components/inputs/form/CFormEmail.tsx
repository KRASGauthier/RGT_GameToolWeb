import CFormComponent, { type CFormSubComponentProps } from "./CFormComponent";

export interface CFormEmailProps extends CFormSubComponentProps {}

function CFormEmail({ ...other }: CFormEmailProps) {

	return <CFormComponent type="email" localFilter={{
		filter: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		message: "Invalid eMail format"
	}} {...other}></CFormComponent>
}

export default CFormEmail;
