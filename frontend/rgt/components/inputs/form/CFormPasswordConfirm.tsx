import type { TFormDataType } from "./CForm";
import type { CFormSubComponentProps } from "./CFormComponent";
import CFormComponentConfirm from "./CFormComponentConfirm";

export interface CFormPasswordConfirmProps extends CFormSubComponentProps {
	valueObject: TFormDataType;

	onMatch: (value: boolean) => void;
}

function CFormPasswordConfirm({ ...other }: CFormPasswordConfirmProps) {
	return (
		<CFormComponentConfirm
			defaultLabel="Password confirm"
			defaultTarget="password"
			errorMessage="Password is not matching"
			type="password"
			{...other}
		/>
	);
}

export default CFormPasswordConfirm;
